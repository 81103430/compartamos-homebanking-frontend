// src/pages/LandingPage.jsx
import { useNavigate } from 'react-router-dom'
import {
  Wallet, CreditCard, Send, FilePlus2, ShieldCheck,
  Clock, Smartphone, MapPin, ArrowRight, Lock,
  PiggyBank, TrendingUp,
} from 'lucide-react'

const PRODUCTOS = [
  { icon: PiggyBank,  color: 'var(--cb-rojo)',    titulo: 'Cuenta de Ahorros',    desc: 'Ahorra sin costo de mantenimiento y gana intereses todos los días.' },
  { icon: Wallet,     color: 'var(--cb-naranja)',  titulo: 'Cuenta Sueldo',        desc: 'Recibe tu sueldo, retira sin comisiones y accede a beneficios exclusivos.' },
  { icon: TrendingUp, color: '#8e24aa',            titulo: 'Crédito Microempresa', desc: 'Impulsa tu negocio con financiamiento ágil. TEA desde 40.92%.' },
  { icon: CreditCard, color: '#0288d1',            titulo: 'Crédito de Consumo',   desc: 'El efectivo que necesitas con cuotas a tu medida.' },
  { icon: Send,       color: '#2e7d32',            titulo: 'Transferencias',       desc: 'Mueve tu dinero entre cuentas al instante, las 24 horas del día.' },
  { icon: FilePlus2,  color: '#c62828',            titulo: 'Solicita en línea',    desc: 'Pide tu crédito desde tu banca por internet sin ir a una agencia.' },
]

const BENEFICIOS = [
  { icon: Smartphone,  titulo: '100% Digital',        desc: 'Opera desde tu celular sin ir a una agencia.' },
  { icon: ShieldCheck, titulo: 'Seguro y protegido',  desc: 'Operaciones cifradas bajo supervisión de la SBS.' },
  { icon: Clock,       titulo: 'Disponible 24/7',     desc: 'Consulta saldos y paga cuotas a cualquier hora.' },
  { icon: MapPin,      titulo: 'Cobertura nacional',  desc: 'Presencia en todo el Perú para servirte mejor.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="lp-page">
      {/* Header público */}
      <header className="lp-header">
        <div className="lp-logo">
          <div className="lp-logo-ico">CB</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Compartamos Banco</div>
            <div style={{ fontSize: 10, opacity: 0.85, letterSpacing: '0.5px' }}>BANCA POR INTERNET</div>
          </div>
        </div>
        <div className="lp-nav-actions">
          <button className="lp-btn-login" onClick={() => navigate('/login')}>
            <Lock size={14} style={{ display: 'inline', marginRight: 6 }} />
            Ingresar
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <span className="lp-hero-tag">Banca Digital · Compartamos Banco</span>
        <h1>Tu banco digital,<br />pensado para ti</h1>
        <p>Abre tu cuenta, paga tus créditos y transfiere tu dinero en minutos. Todo desde tu Banca por Internet, con la seguridad que mereces.</p>
        <div className="lp-hero-actions">
          <button className="lp-btn lp-btn-light" onClick={() => navigate('/login')}>
            <Lock size={17} /> Ingresar a mi banca
          </button>
          <a className="lp-btn lp-btn-outline" href="#productos">
            Conoce nuestros productos <ArrowRight size={17} />
          </a>
        </div>
      </section>

      {/* Quick bar */}
      <div className="lp-quickbar">
        <button className="lp-quick" onClick={() => navigate('/login')}><Wallet size={18} />Abrir cuenta</button>
        <button className="lp-quick" onClick={() => navigate('/login')}><FilePlus2 size={18} />Solicitar crédito</button>
        <button className="lp-quick" onClick={() => navigate('/login')}><Send size={18} />Transferir</button>
        <button className="lp-quick" onClick={() => navigate('/login')}><CreditCard size={18} />Pagar cuota</button>
      </div>

      {/* Productos */}
      <section className="lp-section" id="productos">
        <div className="lp-section-head">
          <h2>Productos para ti</h2>
          <p>Soluciones financieras simples y digitales para cada momento de tu vida.</p>
        </div>
        <div className="lp-products">
          {PRODUCTOS.map(p => {
            const Icon = p.icon
            return (
              <article className="lp-product" key={p.titulo}>
                <div className="lp-product-icon" style={{ background: `${p.color}1a`, color: p.color }}>
                  <Icon size={26} />
                </div>
                <h3>{p.titulo}</h3>
                <p>{p.desc}</p>
                <button className="lp-product-link" onClick={() => navigate('/login')}>
                  Conócelo <ArrowRight size={14} />
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {/* Promo */}
      <section className="lp-promo">
        <div className="lp-promo-inner">
          <div>
            <span className="lp-promo-tag"><TrendingUp size={13} /> Crédito Digital</span>
            <h2>Solicita tu crédito 100% en línea</h2>
            <p>Sin papeleos ni colas. Pide tu crédito microempresa o consumo desde tu Banca por Internet y recibe una respuesta inmediata.</p>
          </div>
          <button className="lp-btn lp-btn-light" onClick={() => navigate('/login')}>
            Solicitar ahora <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* Beneficios */}
      <section className="lp-section" id="beneficios">
        <div className="lp-section-head">
          <h2>¿Por qué Compartamos Banco?</h2>
          <p>Una banca cercana, segura y hecha para el Perú.</p>
        </div>
        <div className="lp-benefits">
          {BENEFICIOS.map(b => {
            const Icon = b.icon
            return (
              <div className="lp-benefit" key={b.titulo}>
                <div className="lp-benefit-icon"><Icon size={24} /></div>
                <h3>{b.titulo}</h3>
                <p>{b.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="lp-footer">
        <p>© 2026 Compartamos Banco · Banca por Internet</p>
        <p>Supervisado por la Superintendencia de Banca, Seguros y AFP (SBS)</p>
        <p style={{ marginTop: 8, fontSize: 11 }}>Proyecto académico — Universidad Continental · Desarrollo de Aplicaciones Web</p>
      </footer>
    </div>
  )
}
