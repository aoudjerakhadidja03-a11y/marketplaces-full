import React, { useState } from 'react';
import { Truck, ShieldCheck, MapPin, Clock, DollarSign, Cpu, CheckCircle2, ArrowRight, X, Send, Globe, PhoneCall } from 'lucide-react';

export const DeliveryPartnersPage = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState('alger');
  const [applyData, setApplyData] = useState({
    company_name: '',
    registration_num: '',
    contact_name: '',
    phone: '',
    email: '',
    wilayas_covered: '58 Wilayas (National)',
    fleet_size: '10-50 Véhicules',
    api_ready: 'yes',
  });
  const [submitted, setSubmitted] = useState(false);

  const partners = [
    {
      id: 1,
      name: 'Yalidine Express Partner',
      badge: 'Partenaire National n°1',
      coverage: '58 Wilayas (Algérie)',
      delay: '24h à 48h',
      options: 'Livraison à domicile & 140+ Bureaux Relais',
      homePrice: '600 DZD',
      stopDeskPrice: '400 DZD',
      apiSupported: 'API Webhook n8n Direct',
    },
    {
      id: 2,
      name: 'ZR Express Direct',
      badge: 'Spécialiste Grand Ouest & Centre',
      coverage: 'Oran, Chlef, Alger, Constantine, Annaba',
      delay: '24h à 72h',
      options: 'Paiement COD sécurisé & Suivi GPS',
      homePrice: '650 DZD',
      stopDeskPrice: '450 DZD',
      apiSupported: 'API REST v2',
    },
    {
      id: 3,
      name: 'EMS Champion Post DZ',
      badge: 'Transporteur Étatique Officiel',
      coverage: '58 Wilayas + International',
      delay: '48h à 96h',
      options: 'Recommandé avec accusé de réception',
      homePrice: '700 DZD',
      stopDeskPrice: '500 DZD',
      apiSupported: 'Tracking Webhook',
    },
    {
      id: 4,
      name: 'Nord-Sud Trans Logistique',
      badge: 'Spécialiste Grand Sud',
      coverage: 'Ouargla, Ghardaïa, Tamanrasset, Béchar, Adrar',
      delay: '3 à 5 Jours',
      options: 'Camions frigorifiques & Cargo lourd',
      homePrice: '1 100 DZD',
      stopDeskPrice: '800 DZD',
      apiSupported: 'Suivi SMS automatique',
    },
  ];

  const wilayaRates = {
    alger: { zone: 'Alger / Tipaza / Blida / Boumerdès', home: '500 DZD', desk: '350 DZD', delay: '24h (Même jour possible)' },
    nord: { zone: 'Wilayas du Nord & Littoral (Oran, Béjaïa, Tizi, Tlemcen, Annaba...)', home: '700 DZD', desk: '450 DZD', delay: '24h à 48h' },
    hauts_plateaux: { zone: 'Hauts Plateaux (Sétif, Batna, Tiaret, Bordj, Djelfa...)', home: '850 DZD', desk: '550 DZD', delay: '48h à 72h' },
    sud: { zone: 'Grand Sud (Ouargla, Biskra, El Oued, Béchar, Ghardaïa...)', home: '1 200 DZD', desk: '800 DZD', delay: '3 à 5 jours' },
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowApplyModal(false);
      setApplyData({
        company_name: '',
        registration_num: '',
        contact_name: '',
        phone: '',
        email: '',
        wilayas_covered: '58 Wilayas (National)',
        fleet_size: '10-50 Véhicules',
        api_ready: 'yes',
      });
    }, 3000);
  };

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span className="badge badge-info" style={{ marginBottom: '0.8rem', padding: '0.4rem 1rem', fontSize: '0.85rem' }}>
          🚚 Réseau Logistique Certifié 58 Wilayas
        </span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0.5rem 0', color: 'var(--text-main)' }}>
          Sociétés de Livraison Partenaires & Intégrations API
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0.5rem auto 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Marketplace DZ s'interconnecte directement avec les meilleurs transporteurs algériens via des Webhooks en temps réel pour garantissant zéro perte de colis et une réduction maximale des retours.
        </p>
      </div>

      {/* Grid of Certified Partners */}
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Truck color="var(--primary)" /> Transporteurs Intégrés au Système
      </h2>

      <div className="grid grid-2" style={{ gap: '1.5rem', marginBottom: '3.5rem' }}>
        {partners.map((p) => (
          <div key={p.id} className="card" style={{ padding: '1.8rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.8rem', borderRadius: '14px', display: 'flex' }}>
                  <Truck size={28} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{p.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 700 }}>{p.badge}</span>
                </div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>Certifié API</span>
            </div>

            <div style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" /> <strong>Zone Couverte :</strong> {p.coverage}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} color="var(--primary)" /> <strong>Délai Moyen :</strong> {p.delay}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--success)" /> <strong>Modes :</strong> {p.options}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={16} color="var(--primary)" /> <strong>Technologie :</strong> {p.apiSupported}
              </div>
            </div>

            <div className="grid grid-2" style={{ gap: '0.8rem', background: 'var(--bg-subtle)', padding: '0.9rem', borderRadius: '10px', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Tarif Domicile</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{p.homePrice}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block' }}>Tarif Stop Desk (Bureau)</span>
                <span style={{ fontWeight: 800, color: 'var(--success)' }}>{p.stopDeskPrice}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simulator: Interactive Shipping Tariff Calculator */}
      <div className="card" style={{ padding: '2rem', marginBottom: '3.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe color="var(--primary)" /> Simulatrice des Tarifs de Livraison par Wilaya
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
          Sélectionnez la zone géographique de destination pour visualiser l'estimation des frais et délais de livraison :
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedZone('alger')}
            className={`btn ${selectedZone === 'alger' ? 'btn-primary' : 'btn-outline'}`}
          >
            Alger & Environs (Zone 1)
          </button>
          <button
            onClick={() => setSelectedZone('nord')}
            className={`btn ${selectedZone === 'nord' ? 'btn-primary' : 'btn-outline'}`}
          >
            Villes du Nord & Littoral (Zone 2)
          </button>
          <button
            onClick={() => setSelectedZone('hauts_plateaux')}
            className={`btn ${selectedZone === 'hauts_plateaux' ? 'btn-primary' : 'btn-outline'}`}
          >
            Hauts Plateaux (Zone 3)
          </button>
          <button
            onClick={() => setSelectedZone('sud')}
            className={`btn ${selectedZone === 'sud' ? 'btn-primary' : 'btn-outline'}`}
          >
            Grand Sud (Zone 4)
          </button>
        </div>

        <div style={{ background: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: '14px', borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
            {wilayaRates[selectedZone].zone}
          </h4>
          <div className="grid grid-3" style={{ gap: '1.2rem' }}>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Livraison à Domicile</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>{wilayaRates[selectedZone].home}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Livraison Bureau (Stop Desk)</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>{wilayaRates[selectedZone].desk}</span>
            </div>
            <div>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block' }}>Délai Moyen d'Acheminement</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{wilayaRates[selectedZone].delay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call To Action Box for Transport Companies */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.15) 100%)', border: '1px solid var(--primary)', textAlign: 'center', padding: '3rem 2rem' }}>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.8rem' }}>Vous êtes une entreprise de transport ou de livraison ?</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.8rem', maxWidth: '650px', margin: '0 auto 1.8rem', lineHeight: 1.6, fontSize: '1.05rem' }}>
          Rejoignez le premier réseau e-commerce algérien équipé de l'algorithme prédictif anti-retour. Bénéficiez d'un volume de livraison constant et de webhooks automatisés.
        </p>
        <button onClick={() => setShowApplyModal(true)} className="btn btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem', fontWeight: 700 }}>
          <Truck size={20} /> Postuler comme Partenaire Logistique
        </button>
      </div>

      {/* Interactive Application Modal (No Blocking Browser Alerts) */}
      {showApplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 900, backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '600px', background: 'var(--card-bg)', border: '1px solid var(--border-color)', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck color="var(--primary)" /> Formulaire de Candidature Partenaire Logistique
              </h3>
              <button onClick={() => setShowApplyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {submitted ? (
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '1.5rem', borderRadius: '12px', textAlign: 'center' }}>
                <CheckCircle2 size={40} style={{ margin: '0 auto 0.8rem display' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Candidature Enregistrée avec Succès !</h4>
                <p style={{ fontSize: '0.92rem', margin: 0 }}>
                  Merci ! Notre département logistique va examiner votre dossier et vous contacter sous 24 heures pour finaliser l'intégration API.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Nom de la Société de Transport *</label>
                  <input type="text" className="form-input" required value={applyData.company_name} onChange={(e) => setApplyData({ ...applyData, company_name: e.target.value })} placeholder="Ex: Express Transport DZ" />
                </div>

                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nom du Responsable *</label>
                    <input type="text" className="form-input" required value={applyData.contact_name} onChange={(e) => setApplyData({ ...applyData, contact_name: e.target.value })} placeholder="Ex: Karim Benziane" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone & WhatsApp *</label>
                    <input type="text" className="form-input" required value={applyData.phone} onChange={(e) => setApplyData({ ...applyData, phone: e.target.value })} placeholder="0550123456" />
                  </div>
                </div>

                <div className="grid grid-2" style={{ gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Couverture Wilayas *</label>
                    <select className="form-select" value={applyData.wilayas_covered} onChange={(e) => setApplyData({ ...applyData, wilayas_covered: e.target.value })}>
                      <option value="58 Wilayas (National)">58 Wilayas (National)</option>
                      <option value="Grand Alger & Centre">Grand Alger & Centre</option>
                      <option value="Villes du Nord & Littoral">Villes du Nord & Littoral</option>
                      <option value="Grand Sud & Sahara">Grand Sud & Sahara</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Taille de la Flotte *</label>
                    <select className="form-select" value={applyData.fleet_size} onChange={(e) => setApplyData({ ...applyData, fleet_size: e.target.value })}>
                      <option value="1-10 Véhicules">1-10 Véhicules</option>
                      <option value="10-50 Véhicules">10-50 Véhicules</option>
                      <option value="50+ Véhicules Pro">50+ Véhicules Pro</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Intégration API / Webhooks Prête ?</label>
                  <select className="form-select" value={applyData.api_ready} onChange={(e) => setApplyData({ ...applyData, api_ready: e.target.value })}>
                    <option value="yes">Oui, nous disposons d'une API REST / Tracking</option>
                    <option value="no">Non, nous utiliserons l'Espace Partenaire Marketplace</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowApplyModal(false)} className="btn btn-secondary">Annuler</button>
                  <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Send size={16} /> Envoyer la Candidature
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
