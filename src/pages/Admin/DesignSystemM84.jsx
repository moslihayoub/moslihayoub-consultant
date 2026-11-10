import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Sparkles,
  Layers,
  Component,
  Copy,
  Check,
  Play,
  RotateCcw,
  Code2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Eye
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  StatCard,
  Input,
  Textarea,
  Select,
  Modal,
  Drawer,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
  Tabs,
  Toast,
  fadeIn,
  slideUp,
  scaleIn,
  buttonTapMotion,
  cardHoverMotion,
  pulseGlowMotion
} from '../../design-system';

export default function DesignSystemM84() {
  const [activeTab, setActiveTab] = useState('components');
  const [copiedKey, setCopiedKey] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', message: '', variant: 'info' });
  const [animTrigger, setAnimTrigger] = useState(0);

  const copyToClipboard = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const triggerToast = (variant, title, message) => {
    setToastMessage({ title, message, variant });
    setShowToast(true);
  };

  const navTabs = [
    { id: 'components', label: 'Composants UI' },
    { id: 'tokens', label: 'Tokens & Couleurs' },
    { id: 'animations', label: 'Animations & Effets' },
    { id: 'guidelines', label: 'Gouvernance & Specs' }
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Showcase */}
      <div style={{
        background: 'linear-gradient(135deg, #006253 0%, #004d40 100%)',
        color: '#ffffff',
        borderRadius: 'var(--m84-radius-xl)',
        padding: '36px',
        boxShadow: 'var(--m84-shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <Badge variant="ai" icon={<Sparkles size={14} />}>
              M84 DESIGN SYSTEM v1.0
            </Badge>
            <Badge variant="outline" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}>
              shadcn-inspired
            </Badge>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            Design System M84
          </h1>
          <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '640px', lineHeight: 1.6 }}>
            Bibliothèque centrale de tokens, composants atomiques, animations Framer Motion et micro-interactions harmonisés pour le Portfolio, le Backoffice et le Portail M84 Ops.
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              onClick={() => copyToClipboard("import { Button, Badge, Card, StatCard } from '../../design-system';", 'import')}
              icon={copiedKey === 'import' ? <Check size={16} /> : <Copy size={16} />}
            >
              {copiedKey === 'import' ? 'Import copié !' : 'Copier import racine'}
            </Button>
            <Button
              variant="outline"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}
              onClick={() => triggerToast('success', 'Synchronisation Design System', 'Tous les composants sont alignés sur le standard M84.')}
              icon={<ShieldCheck size={16} />}
            >
              Vérifier Conformité M84
            </Button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.25)',
          filter: 'blur(60px)',
          zIndex: 1
        }} />
      </div>

      {/* Navigation Tabs */}
      <div style={{ borderBottom: '1px solid var(--m84-border-subtle)', paddingBottom: '4px' }}>
        <Tabs tabs={navTabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* TAB 1: COMPOSANTS UI */}
      {activeTab === 'components' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Section: Boutons */}
          <Card>
            <CardHeader>
              <CardTitle>1. Boutons (`Button`)</CardTitle>
              <CardDescription>Boutons hautement configurables avec variantes, micro-interactions tap, états de chargement et support d'icônes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                <Button variant="primary">Bouton Principal</Button>
                <Button variant="secondary">Bouton Secondaire</Button>
                <Button variant="outline">Contour</Button>
                <Button variant="ghost">Fantôme</Button>
                <Button variant="danger">Destructif</Button>
                <Button variant="ai" icon={<Sparkles size={16} />}>Action IA</Button>
                <Button variant="primary" loading>Chargement</Button>
                <Button variant="primary" size="sm">Petit</Button>
                <Button variant="primary" size="lg">Grand</Button>
              </div>
            </CardContent>
            <CardFooter>
              <code style={{ fontSize: '0.85rem', color: 'var(--m84-text-muted)', fontFamily: 'monospace' }}>
                {`<Button variant="primary" icon={<Check />} onClick={handleClick}>Valider</Button>`}
              </code>
            </CardFooter>
          </Card>

          {/* Section: Badges */}
          <Card>
            <CardHeader>
              <CardTitle>2. Badges & Statuts (`Badge`)</CardTitle>
              <CardDescription>Étiquettes sémantiques pour exprimer les statuts de validation CRA, contrats, priorités et IA.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <Badge variant="default">Défaut</Badge>
                <Badge variant="success" icon={<CheckCircle2 size={12} />}>Approuvé / Signé</Badge>
                <Badge variant="warning" icon={<AlertTriangle size={12} />}>En attente</Badge>
                <Badge variant="danger" icon={<XCircle size={12} />}>Rejeté</Badge>
                <Badge variant="info" icon={<Info size={12} />}>Information</Badge>
                <Badge variant="outline">Contour</Badge>
                <Badge variant="ai" icon={<Sparkles size={12} />}>M84 AI Agent</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Section: StatCards */}
          <Card>
            <CardHeader>
              <CardTitle>3. Cartes de Métriques (`StatCard`)</CardTitle>
              <CardDescription>Indicateurs de performance standardisés pour les dashboards Backoffice et Portail.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                <StatCard
                  title="Missions Actives"
                  value="4"
                  trend="+2 ce trimestre"
                  trendPositive={true}
                  badge={<Badge variant="success">En cours</Badge>}
                  progress={75}
                  progressColor="#006253"
                />
                <StatCard
                  title="Jours Imputés (CRA)"
                  value="21.5 j"
                  trend="100% de l'objectif"
                  trendPositive={true}
                  badge={<Badge variant="info">Oct 2026</Badge>}
                  progress={100}
                  progressColor="#10b981"
                />
                <StatCard
                  title="Taux de Satisfaction"
                  value="98.5%"
                  trend="+1.2% vs N-1"
                  trendPositive={true}
                  badge={<Badge variant="ai">B2B Audit</Badge>}
                />
              </div>
            </CardContent>
          </Card>

          {/* Section: Formulaires */}
          <Card>
            <CardHeader>
              <CardTitle>4. Contrôles de Formulaire (`Input`, `Select`, `Textarea`)</CardTitle>
              <CardDescription>Champs stylisés avec gestion des focus rings `--m84-primary` et messages d'aide contextuels.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <Input
                  label="Nom du Collaborateur"
                  placeholder="ex: Ayoub MOSLIH"
                  helperText="Utilisé pour les fiches de mission et visas CRA."
                />
                <Select
                  label="Statut du Dossier"
                  options={[
                    { value: 'draft', label: 'Brouillon' },
                    { value: 'submitted', label: 'Soumis pour validation' },
                    { value: 'validated', label: 'Validé & Signé' }
                  ]}
                />
                <div style={{ gridColumn: '1 / -1' }}>
                  <Textarea
                    label="Notes & Observations"
                    placeholder="Saisissez vos remarques ou compte rendu d'activité..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section: Modales, Drawers & Toasts Interactifs */}
          <Card>
            <CardHeader>
              <CardTitle>5. Overlays (`Modal`, `Drawer`, `Toast`)</CardTitle>
              <CardDescription>Composants flottants accessibles, avec backdrop animé et contrôle du focus.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  Ouvrir Modale de Démonstration
                </Button>
                <Button variant="secondary" onClick={() => setShowDrawer(true)}>
                  Ouvrir Tiroir Latéral (Drawer)
                </Button>
                <Button variant="outline" onClick={() => triggerToast('info', 'Notification M84', 'Ceci est un toast du Design System M84.')}>
                  Afficher Toast Notification
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section: Tableau */}
          <Card>
            <CardHeader>
              <CardTitle>6. Tableau de Données (`Table`)</CardTitle>
              <CardDescription>Structure tabulaire épurée pour listes d'imputations, comptes rendus et CRM.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Réf Mission</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Période</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead align="right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>CAM-2026-01</TableCell>
                    <TableCell>Crédit Agricole du Maroc</TableCell>
                    <TableCell>Octobre 2026</TableCell>
                    <TableCell><Badge variant="success">Validé</Badge></TableCell>
                    <TableCell align="right">
                      <Button variant="ghost" size="sm">Consulter</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>DEV-2026-03</TableCell>
                    <TableCell>Devoteam Middle East</TableCell>
                    <TableCell>Novembre 2026</TableCell>
                    <TableCell><Badge variant="warning">En attente</Badge></TableCell>
                    <TableCell align="right">
                      <Button variant="ghost" size="sm">Consulter</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      )}

      {/* TAB 2: TOKENS & COULEURS */}
      {activeTab === 'tokens' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Palette de Couleurs M84 (`tokens.css`)</CardTitle>
              <CardDescription>Teintes maîtresses sélectionnées pour assurer le contraste WCAG AAA et l'identité de marque M84.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                
                {[
                  { name: 'Vert M84 Primary', hex: '#006253', varName: '--m84-primary' },
                  { name: 'Vert Primary Hover', hex: '#004d40', varName: '--m84-primary-hover' },
                  { name: 'Vert Primary Light', hex: '#e6efee', varName: '--m84-primary-light' },
                  { name: 'Emeraude Accent', hex: '#10b981', varName: '--m84-accent' },
                  { name: 'Dark Surface', hex: '#0a0a0a', varName: '--m84-dark' },
                  { name: 'Fond Neutre', hex: '#FAFAFA', varName: '--m84-bg' },
                  { name: 'Texte Principal', hex: '#0f172a', varName: '--m84-text-primary' },
                  { name: 'Texte Muted', hex: '#64748b', varName: '--m84-text-muted' },
                ].map((color) => (
                  <div
                    key={color.varName}
                    onClick={() => copyToClipboard(`var(${color.varName})`, color.varName)}
                    style={{
                      border: '1px solid var(--m84-border-subtle)',
                      borderRadius: 'var(--m84-radius-md)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <div style={{ height: '70px', background: color.hex }} />
                    <div style={{ padding: '12px', background: '#ffffff' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{color.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--m84-text-muted)', fontFamily: 'monospace', marginTop: '4px' }}>
                        {color.hex} • {color.varName}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#006253', fontWeight: 600, marginTop: '4px' }}>
                        {copiedKey === color.varName ? '✓ Copié !' : 'Cliquer pour copier'}
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </CardContent>
          </Card>

          {/* Rayons de bordure & Ombres */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <Card>
              <CardHeader>
                <CardTitle>Rayons de Courbure (Radii)</CardTitle>
                <CardDescription>Normalisation des arrondis de cartes et boutons.</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ padding: '12px', background: '#e6efee', borderRadius: 'var(--m84-radius-sm)', fontSize: '0.85rem' }}>
                    <code>--m84-radius-sm</code> (8px) - Boutons, badges, inputs
                  </div>
                  <div style={{ padding: '12px', background: '#e6efee', borderRadius: 'var(--m84-radius-md)', fontSize: '0.85rem' }}>
                    <code>--m84-radius-md</code> (12px) - Cartes, conteneurs
                  </div>
                  <div style={{ padding: '12px', background: '#e6efee', borderRadius: 'var(--m84-radius-lg)', fontSize: '0.85rem' }}>
                    <code>--m84-radius-lg</code> (16px) - Modales, panneaux majeurs
                  </div>
                  <div style={{ padding: '12px', background: '#e6efee', borderRadius: 'var(--m84-radius-xl)', fontSize: '0.85rem' }}>
                    <code>--m84-radius-xl</code> (24px) - Bannières hero, hero cards
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Typographie</CardTitle>
                <CardDescription>Police de référence et échelle hiérarchique.</CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>Space Grotesk H1 (800)</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Space Grotesk H2 (700)</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 600 }}>Space Grotesk H3 (600)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 400, color: 'var(--m84-text-secondary)' }}>Corps de texte standard (Inter / Space Grotesk)</div>
                  <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--m84-text-muted)' }}>Code / Données monétaires / JSON</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 3: ANIMATIONS & EFFETS */}
      {activeTab === 'animations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <CardTitle>Presets Framer Motion (`Animations.js`)</CardTitle>
                  <CardDescription>Catalogue d'animations synchronisées et prêtes à l'emploi.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAnimTrigger(prev => prev + 1)}
                  icon={<RotateCcw size={14} />}
                >
                  Rejouer les animations
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div key={animTrigger} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                
                {/* Fade In */}
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--m84-radius-md)',
                    border: '1.5px solid var(--m84-border-subtle)',
                    background: '#ffffff',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>fadeIn</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--m84-text-muted)', margin: 0 }}>
                    Apparition progressive en opacité (0.25s ease-out).
                  </p>
                </motion.div>

                {/* Slide Up */}
                <motion.div
                  variants={slideUp}
                  initial="hidden"
                  animate="visible"
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--m84-radius-md)',
                    border: '1.5px solid var(--m84-border-subtle)',
                    background: '#ffffff',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>slideUp</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--m84-text-muted)', margin: 0 }}>
                    Translation ascendante de +16px avec fondu doux.
                  </p>
                </motion.div>

                {/* Scale In */}
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--m84-radius-md)',
                    border: '1.5px solid var(--m84-border-subtle)',
                    background: '#ffffff',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>scaleIn</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--m84-text-muted)', margin: 0 }}>
                    Agrandissement doux (0.95 → 1.0) pour modales et badges.
                  </p>
                </motion.div>

                {/* Card Hover Motion */}
                <motion.div
                  {...cardHoverMotion}
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--m84-radius-md)',
                    border: '1.5px solid var(--m84-primary)',
                    background: 'var(--m84-primary-light)',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#006253', marginBottom: '6px' }}>cardHoverMotion</div>
                  <p style={{ fontSize: '0.85rem', color: '#006253', margin: 0 }}>
                    Survolez-moi : Élévation de -4px et ombre portée dynamique.
                  </p>
                </motion.div>

              </div>
            </CardContent>
          </Card>

          {/* Effets Visuels & Glassmorphism */}
          <Card>
            <CardHeader>
              <CardTitle>Effets d'Arrière-Plan & Glassmorphism</CardTitle>
              <CardDescription>Styles CSS avancés pour les bannières immersives et les composants IA.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* Glassmorphism Card */}
                <div style={{
                  padding: '28px',
                  borderRadius: 'var(--m84-radius-lg)',
                  background: 'rgba(255, 255, 255, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: 'var(--m84-shadow-md)',
                  position: 'relative'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '8px' }}>Glassmorphism M84</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--m84-text-secondary)', margin: 0 }}>
                    Utilisé sur les widgets flottants (`ChatWidget`), menus contextuels et modales.
                  </p>
                </div>

                {/* Pulse Glow Effect */}
                <motion.div
                  {...pulseGlowMotion}
                  style={{
                    padding: '28px',
                    borderRadius: 'var(--m84-radius-lg)',
                    background: '#0a0a0a',
                    color: '#ffffff',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                    <Sparkles size={16} /> M84 AI Glow
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)', margin: '8px 0 0 0' }}>
                    Pulsation lumineuse douce pour les fonctionnalités IA et les agents autonomes.
                  </p>
                </motion.div>

              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: GOUVERNANCE & SPECS */}
      {activeTab === 'guidelines' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Gouvernance & Principes Directeurs</CardTitle>
              <CardDescription>Règles d'or pour préserver l'intégrité visuelle et technique de l'écosystème M84.</CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 'var(--m84-radius-md)', borderLeft: '4px solid #006253' }}>
                  <div style={{ fontWeight: 700, color: '#006253', marginBottom: '4px' }}>1. Single Source of Truth (SSOT)</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--m84-text-secondary)', margin: 0 }}>
                    Tout nouveau composant doit résider dans <code>src/design-system/</code> et être exporté dans <code>index.js</code>. Aucune redéfinition locale de style générique n'est tolérée.
                  </p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 'var(--m84-radius-md)', borderLeft: '4px solid #10b981' }}>
                  <div style={{ fontWeight: 700, color: '#006253', marginBottom: '4px' }}>2. Respect Strict des Tokens CSS</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--m84-text-secondary)', margin: 0 }}>
                    Ne jamais coder en dur des valeurs hexadécimales orphelines. Toujours faire appel aux variables <code>var(--m84-primary)</code>, <code>var(--m84-radius-md)</code>, etc.
                  </p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: 'var(--m84-radius-md)', borderLeft: '4px solid #3b82f6' }}>
                  <div style={{ fontWeight: 700, color: '#006253', marginBottom: '4px' }}>3. Accessibilité WCAG 2.1 AA / AAA</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--m84-text-secondary)', margin: 0 }}>
                    Chaque composant interactif inclut la navigation clavier (Échap pour modale/drawer), des focus states visibles et un ratio de contraste supérieur à 4.5:1 sur texte normal.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* DÉMO MODALE */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Modale de Démonstration M84"
        description="Composant accessible basé sur Framer Motion avec capture d'événement clavier."
      >
        <p style={{ fontSize: '0.95rem', color: 'var(--m84-text-secondary)', lineHeight: 1.6 }}>
          Cette modale utilise les tokens de rayon, d'ombre et de typographie unifiés. Appuyez sur la touche <strong>Échap</strong> ou cliquez à l'extérieur pour la refermer.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button variant="outline" onClick={() => setShowModal(false)}>Fermer</Button>
          <Button variant="primary" onClick={() => { setShowModal(false); triggerToast('success', 'Action Validée', 'Modale fermée avec succès.'); }}>
            Confirmer l'action
          </Button>
        </div>
      </Modal>

      {/* DÉMO DRAWER */}
      <Drawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        title="Tiroir Latéral M84"
        position="right"
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--m84-text-secondary)', lineHeight: 1.6 }}>
          Le Drawer permet d'afficher les fiches détails de missions, les profils collaborateurs ou les audits sans quitter la vue active.
        </p>
        <div style={{ marginTop: '20px' }}>
          <Badge variant="ai">Détails IA Synchronisés</Badge>
        </div>
        <div style={{ marginTop: '30px' }}>
          <Button variant="secondary" onClick={() => setShowDrawer(false)} style={{ width: '100%' }}>
            Fermer le panneau
          </Button>
        </div>
      </Drawer>

      {/* TOAST FLOTTANT */}
      <Toast
        isOpen={showToast}
        onClose={() => setShowToast(false)}
        title={toastMessage.title}
        message={toastMessage.message}
        variant={toastMessage.variant}
        duration={3500}
      />

    </div>
  );
}
