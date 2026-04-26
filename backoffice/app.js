// Firebase config snippet (To be populated with actual config)
const firebaseConfig = {
  projectId: "ayoub-moslih-portfolio-v2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

function checkAuth() {
  auth.onAuthStateChanged(user => {
    if (user) {
      document.getElementById('loginScreen').style.display = 'none';
      loadPortfolio();
    } else {
      document.getElementById('loginScreen').style.display = 'flex';
    }
  });
}

function login() {
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;
  
  // Mapping username to a fake admin email for Firebase Auth
  const email = user === 'moslih84' ? 'moslih84@admin.com' : user;
  
  auth.signInWithEmailAndPassword(email, pass).catch(error => {
    if (error.code === 'auth/user-not-found') {
      // Auto-create the admin user the first time if it doesn't exist
      auth.createUserWithEmailAndPassword(email, pass).catch(err => {
        document.getElementById('errorMsg').innerText = "Erreur : " + err.message;
        document.getElementById('errorMsg').style.display = 'block';
      });
    } else {
      document.getElementById('errorMsg').style.display = 'block';
    }
  });
}

function logout() {
  auth.signOut();
}

// Load data from Firestore
async function loadPortfolio() {
  const list = document.getElementById('portfolioList');
  try {
    const snapshot = await db.collection('portfolio').get();
    if (snapshot.empty) {
      list.innerHTML = '<tr><td colspan="4" style="text-align:center;color:#868685">Aucun projet trouvé.</td></tr>';
      return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `
        <tr>
          <td>${data.title || 'Sans titre'}</td>
          <td>${data.category || '-'}</td>
          <td>${data.year || '-'}</td>
          <td>
            <button class="action-btn" onclick="editProject('${doc.id}')"><i data-lucide="edit"></i></button>
            <button class="action-btn del" onclick="deleteProject('${doc.id}')"><i data-lucide="trash-2"></i></button>
          </td>
        </tr>
      `;
    });
    list.innerHTML = html;
    lucide.createIcons();
  } catch(e) {
    console.error("Firestore is not yet fully configured.", e);
  }
}

async function deleteProject(id) {
  if(confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
    await db.collection('portfolio').doc(id).delete();
    loadPortfolio();
  }
}

function editProject(id) {
  alert('Édition du projet ' + id + ' (En développement)');
}

document.addEventListener('DOMContentLoaded', checkAuth);