import React from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyApi } from '../services/api';

const Shell = styled.div`
  min-height:100vh; background:#f6f8fb;
`;
const Hero = styled.div`
  background:#0f172a; color:#fff; padding: 40px 0 60px;
`;
const Container = styled.div`
  max-width:1200px; margin:0 auto; padding: 0 20px;
`;
const H1 = styled.h1`
  font-size:48px; margin:0 0 10px; letter-spacing:-0.02em;
`;
const Blurb = styled.p` color:#cbd5e1; margin:0; max-width:720px; `;
const Panel = styled.div`
  background:#fff; border:1px solid #e5e7eb; margin-top:-28px; border-radius:16px; padding:14px; box-shadow:0 10px 24px rgba(2,6,23,0.08);
`;
const Filters = styled.div`
  display:flex; gap:10px; flex-wrap:wrap;
`;
const Select = styled.select`
  border:1px solid #e5e7eb; border-radius:10px; padding:8px 10px; background:#fff; font-weight:700;
`;
const Input = styled.input`
  border:1px solid #e5e7eb; border-radius:10px; padding:8px 10px; width:120px;
`;
const Grid = styled.div`
  display:grid; grid-template-columns: 1fr 1fr 1fr; gap:16px; margin-top:16px;
  @media (max-width: 1000px){ grid-template-columns: 1fr 1fr; }
  @media (max-width: 700px){ grid-template-columns: 1fr; }
`;
const Card = styled.a`
  display:block; text-decoration:none; background:#eaf6ff; border:1px solid #dbeafe; border-radius:14px; overflow:hidden; color:#0f172a;
`;
const Img = styled.div<{src:string}>`
  height:180px; background:url(${p=>p.src}) center/cover no-repeat; background-color:#f1f5f9;
`;
const Body = styled.div` padding:10px 12px; `;
const Tag = styled.span`
  display:inline-flex; align-items:center; gap:6px; background:#fff; border:1px solid #e2e8f0; color:#0f172a; padding:4px 8px; border-radius:9px; font-size:12px; font-weight:800;
`;
const Tags = styled.div` display:flex; gap:8px; flex-wrap:wrap; margin-top:8px; `;

function unslug(s:string){ return (s||'').replace(/-/g,' '); }

const HuurwoningenCity: React.FC = () => {
  const { city: citySlug } = useParams();
  const cityName = unslug(citySlug || '');
  const navigate = useNavigate();
  const [count, setCount] = React.useState<number>(0);
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [minPrice, setMinPrice] = React.useState<string>('');
  const [maxPrice, setMaxPrice] = React.useState<string>('');
  const [minRooms, setMinRooms] = React.useState<string>('');
  const [minSize, setMinSize] = React.useState<string>('');
  const [sort, setSort] = React.useState<string>('-scrapedAt');
  const [page, setPage] = React.useState<number>(1);
  const [pages, setPages] = React.useState<number>(1);
  const [furnished, setFurnished] = React.useState<string>('any');

  const fetchData = React.useCallback(async ()=>{
    setLoading(true);
    // Scroll naar boven voor betere UX bij pagina wissel
    if (page > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    try {
      const params:any = { limit: 24, sort, page };
      if (citySlug && citySlug !== 'alle') params.city = citySlug;
      if (minPrice) params.min_prijs = minPrice;
      if (maxPrice) params.max_prijs = maxPrice;
      if (minRooms) params.bedrooms = minRooms;
      if (minSize) params.min_size = minSize;
      if (furnished !== 'any') params.furnished = furnished;

      const res:any = await propertyApi.getProperties(params);
      setItems(res?.properties || []);
      if (res?.pagination){
        setPages(res.pagination.pages || 1);
        setCount(res.pagination.total || 0);
      }
    } catch(e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  },[citySlug, minPrice, maxPrice, minRooms, minSize, sort, furnished, page]);

  React.useEffect(()=>{
    // Reset naar pagina 1 bij filter wijziging
    if (page !== 1) {
      setPage(1);
    } else {
      fetchData().catch(()=>{});
    }
  }, [citySlug, minPrice, maxPrice, minRooms, minSize, sort, furnished]);

  React.useEffect(()=>{
    fetchData().catch(()=>{});
  }, [page]);

  // Public behavior: always go to external source when available; otherwise internal detail
  const cardHref = (p:any) => p.sourceUrl ? p.sourceUrl : (p._id ? `/woning/${p._id}` : '#');

  const pickImage = (arr:any[]):string => {
    if (!Array.isArray(arr) || !arr.length) return 'https://cdn.pixabay.com/photo/2017/08/06/09/53/home-2593242_1280.jpg';
    // Veel uitgebreidere filtering om profielfoto's uit te sluiten
    const badHints = [
      'avatar','profile','logo','placeholder','user','icon','stock','trustpilot',
      'member','face','person','people','portrait','headshot','selfie','photo/user',
      '/users/','/members/','/profiles/','/avatars/','-avatar','-profile','-user',
      'default-avatar','default-profile','no-photo','dummy','blank'
    ];
    // Filter alle images die verdachte patronen bevatten
    const filtered = arr.filter(u => {
      if (typeof u !== 'string') return false;
      const lower = u.toLowerCase();
      // Check of het een van de bad hints bevat
      if (badHints.some(b => lower.includes(b))) return false;
      // Check of het een te kleine afbeelding is (vaak avatars zijn klein)
      if (lower.match(/\d+x\d+/) && lower.match(/[2-9]\dx[2-9]\d/)) return false; // 20x20 tot 99x99
      return true;
    });
    // Return eerste goede image, of fallback naar huisje
    return filtered[0] || 'https://cdn.pixabay.com/photo/2017/08/06/09/53/home-2593242_1280.jpg';
  };

  return (
    <Shell>
      <Hero>
        <Container>
          <H1>{count} huurwoningen {citySlug==='alle' ? 'in Nederland' : `in ${cityName}`}</H1>
          <Blurb>Filter op prijs, kamers, oppervlak en extra wensen. Klik op een woning om je gratis aan te melden en direct alerts te krijgen.</Blurb>
          <Panel>
            <Filters>
              <Select value={sort} onChange={(e)=>setSort(e.target.value)} title="Sorteer resultaten">
                <option value="-scrapedAt">📅 Nieuwste eerst</option>
                <option value="price">💶 Goedkoopste eerst</option>
                <option value="-price">💰 Duurste eerst</option>
                <option value="-size">📐 Grootste m² eerst</option>
              </Select>
              <Input
                type="number"
                placeholder="Min. €"
                value={minPrice}
                onChange={(e)=>setMinPrice(e.target.value)}
                title="Minimum huurprijs"
              />
              <Input
                type="number"
                placeholder="Max. €"
                value={maxPrice}
                onChange={(e)=>setMaxPrice(e.target.value)}
                title="Maximum huurprijs"
              />
              <Input
                type="number"
                placeholder="Min. kamers"
                value={minRooms}
                onChange={(e)=>setMinRooms(e.target.value)}
                title="Minimaal aantal kamers"
              />
              <Input
                type="number"
                placeholder="Min. m²"
                value={minSize}
                onChange={(e)=>setMinSize(e.target.value)}
                title="Minimale oppervlakte"
              />
              <Select value={furnished} onChange={(e)=>setFurnished(e.target.value)} title="Gemeubileerd filter">
                <option value="any">🪑 Gemeubileerd (alle)</option>
                <option value="true">✅ Gemeubileerd</option>
                <option value="false">❌ Ongemeubileerd</option>
              </Select>
              <button
                style={{borderRadius:10, border:'1px solid #e2e8f0', padding:'8px 12px', fontWeight:800, background:'#f1f5f9', cursor:'pointer'}}
                onClick={()=>{
                  setMinPrice('');
                  setMaxPrice('');
                  setMinRooms('');
                  setMinSize('');
                  setFurnished('any');
                  setSort('-scrapedAt');
                }}
                title="Wis alle filters"
              >
                🔄 Reset filters
              </button>
            </Filters>
          </Panel>
        </Container>
      </Hero>

      <Container>
        {loading && (
          <div style={{display:'flex', justifyContent:'center', alignItems:'center', padding:'60px 0', color:'#475569'}}>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:40, marginBottom:12}}>⏳</div>
              <div style={{fontWeight:700}}>Woningen laden...</div>
            </div>
          </div>
        )}

        {!loading && (
          <>
            <Grid>
              {items.map((p:any)=>{
                const img = pickImage(p.images);
                return (
                  <Card key={p._id} href={cardHref(p)} target={p.sourceUrl ? '_blank' : undefined} rel={p.sourceUrl ? 'noopener noreferrer' : undefined}>
                    <Img src={img} />
                    <Body>
                      <div style={{fontWeight:900, fontSize:18}}>{p.title || p.address?.street || 'Woning'}</div>
                      <div style={{color:'#475569', marginTop:4}}>{p.address?.city} • {p.size||'—'}m² • €{p.price||'—'}</div>
                      <Tags>
                        <Tag>📍 {p.address?.city}</Tag>
                        <Tag>🛏 {p.rooms ?? '?'}</Tag>
                        <Tag>📐 {p.size || '—'}m²</Tag>
                        <Tag>💶 €{p.price || '—'}</Tag>
                      </Tags>
                    </Body>
                  </Card>
                );
              })}
            </Grid>
            {items.length === 0 && (
              <div style={{padding:'24px 0', color:'#475569'}}>Geen woningen gevonden. Probeer je filters te verruimen.</div>
            )}
          </>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div style={{display:'flex', justifyContent:'center', gap:8, margin:'24px 0'}}>
            <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #e2e8f0'}}>Vorige</button>
            <div style={{alignSelf:'center', fontWeight:800}}>Pagina {page} / {pages}</div>
            <button disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages, p+1))} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #e2e8f0'}}>Volgende</button>
          </div>
        )}
      </Container>
    </Shell>
  );
};

export default HuurwoningenCity;
