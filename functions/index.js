const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { BetaAnalyticsDataClient } = require("@google-analytics/data");

admin.initializeApp();

// You can set these via environment variables or Firebase Secret Manager
// firebase functions:secrets:set GA_PROPERTY_ID
// firebase functions:secrets:set GA_CLIENT_EMAIL
// firebase functions:secrets:set GA_PRIVATE_KEY

exports.getAnalyticsData = functions.https.onCall(async (data, context) => {
  // Optionnel : vérifier si l'utilisateur est authentifié pour plus de sécurité
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated.');
  // }

  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    
    // Configurer le client Analytics avec le Service Account
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        // Replace escaped newline characters from environment variable
        private_key: (process.env.GA_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }
    });

    if (!propertyId || !process.env.GA_CLIENT_EMAIL || !process.env.GA_PRIVATE_KEY) {
      throw new Error("Missing Google Analytics credentials or property ID.");
    }

    // Exemple de requête pour récupérer les utilisateurs actifs des 7 derniers jours
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'day', // e.g., '01', '02'
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });

    const trafficData = response.rows?.map(row => ({
      name: `Jour ${row.dimensionValues[0].value}`,
      visites: parseInt(row.metricValues[0].value, 10),
    })) || [];

    return { success: true, data: trafficData };

  } catch (error) {
    console.error("Error fetching GA4 data:", error);
    throw new functions.https.HttpsError('internal', 'Unable to fetch analytics data.', error.message);
  }
});
