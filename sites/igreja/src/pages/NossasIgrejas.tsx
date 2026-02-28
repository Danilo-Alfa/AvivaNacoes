import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock, ExternalLink, Maximize2, X } from "lucide-react";
import { getIgrejasAtivas, type Igreja } from "@/services/igrejaService";

/* ── Country helpers ── */

const COUNTRY_ORDER: Record<string, number> = {
  Brasil: 0,
  Argentina: 1,
  "África": 2,
  EUA: 3,
};

function CountryFlag({ country, size = 24 }: { country: string; size?: number }) {
  const h = Math.round(size * 0.7);
  const cls = "rounded-sm shadow-sm flex-shrink-0";

  switch (country) {
    case "Brasil":
      return (
        <svg width={size} height={h} viewBox="0 0 30 21" className={cls} aria-label="Bandeira do Brasil">
          <rect width="30" height="21" fill="#009c3b" />
          <polygon points="15,2.5 28,10.5 15,18.5 2,10.5" fill="#ffdf00" />
          <circle cx="15" cy="10.5" r="5" fill="#002776" />
          <path d="M10.5,10.5 Q15,8 19.5,10.5" stroke="#fff" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case "Argentina":
      return (
        <svg width={size} height={h} viewBox="0 0 30 21" className={cls} aria-label="Bandeira da Argentina">
          <rect width="30" height="7" fill="#74ACDF" />
          <rect y="7" width="30" height="7" fill="#fff" />
          <rect y="14" width="30" height="7" fill="#74ACDF" />
          <circle cx="15" cy="10.5" r="2.5" fill="#F6B40E" />
        </svg>
      );
    case "EUA":
      return (
        <svg width={size} height={h} viewBox="0 0 30 21" className={cls} aria-label="Bandeira dos EUA">
          {Array.from({ length: 13 }, (_, i) => (
            <rect key={i} y={i * 1.615} width="30" height="1.615" fill={i % 2 === 0 ? "#B22234" : "#fff"} />
          ))}
          <rect width="12" height="11.3" fill="#3C3B6E" />
          {[2, 5, 8, 11].flatMap((x) =>
            [2, 4.5, 7, 9.5].map((y) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="0.5" fill="#fff" />
            )),
          )}
        </svg>
      );
    case "África":
      return null;
    default:
      return <MapPin className="w-5 h-5 text-primary" />;
  }
}

type IgrejaSection = { title: string; count: number; data: Igreja[] };

function groupByCountry(igrejas: Igreja[]): IgrejaSection[] {
  const groups = new Map<string, Igreja[]>();
  for (const igreja of igrejas) {
    const key = igreja.pais || "Outras";
    const list = groups.get(key);
    if (list) list.push(igreja);
    else groups.set(key, [igreja]);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const oa = COUNTRY_ORDER[a] ?? 999;
      const ob = COUNTRY_ORDER[b] ?? 999;
      return oa - ob;
    })
    .map(([title, data]) => ({ title, count: data.length, data }));
}

/* ── Skeleton ── */

function IgrejaCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Igreja Card ── */

function IgrejaCard({
  igreja,
  onImagePress,
}: {
  igreja: Igreja;
  onImagePress: (url: string, nome: string) => void;
}) {
  return (
    <Card className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1 h-full flex flex-col">
      <CardContent className="p-0 flex flex-col flex-1">
        {igreja.imagem_url ? (
          <div className="relative group">
            <img
              src={igreja.imagem_url}
              alt={igreja.nome}
              width={400}
              height={225}
              loading="lazy"
              decoding="async"
              className="aspect-video w-full object-cover rounded-t-lg"
            />
            <button
              onClick={() => onImagePress(igreja.imagem_url!, igreja.nome)}
              className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              aria-label={`Ver foto de ${igreja.nome} em tela cheia`}
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="aspect-video bg-gradient-hero rounded-t-lg flex items-center justify-center">
            <span className="text-xl text-primary-foreground font-semibold">
              {igreja.nome}
            </span>
          </div>
        )}

        <div className="p-6 pb-6 flex flex-col gap-3 flex-1">
          <h3 className="text-xl font-bold">
            {igreja.nome}
            {igreja.bairro ? ` - ${igreja.bairro}` : ""}
            <div className="w-full h-0.5 bg-primary/30 my-4"></div>
          </h3>

          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-foreground">Endereço</p>
                <p className="text-sm text-muted-foreground">
                  {igreja.endereco}
                  {igreja.cidade && (
                    <>
                      <br />
                      {igreja.cidade}
                      {igreja.cep ? `, CEP ${igreja.cep}` : ""}
                    </>
                  )}
                </p>
              </div>
            </div>

            {(igreja.telefone || igreja.whatsapp) && (
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">Telefone</p>
                  <p className="text-sm text-muted-foreground">
                    {igreja.telefone || igreja.whatsapp}
                  </p>
                </div>
              </div>
            )}

            {igreja.horarios && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">Horários</p>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {igreja.horarios}
                  </p>
                </div>
              </div>
            )}
          </div>

          {igreja.pastor && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-2">
                Pastor(a) Responsável:
              </p>
              <p className="text-sm text-muted-foreground">{igreja.pastor}</p>
            </div>
          )}

          {igreja.latitude && igreja.longitude ? (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${igreja.latitude},${igreja.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-4 flex items-center justify-center gap-2 w-full text-center px-4 py-3 min-h-[48px] bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4" />
              Ver no Google Maps
            </a>
          ) : (
            <div className="mt-auto pt-4">
              <span className="block w-full text-center px-4 py-3 min-h-[48px] bg-muted text-muted-foreground rounded-lg text-sm font-medium cursor-not-allowed">
                Localização indisponível
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Page ── */

export default function NossasIgrejas() {
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagemFullscreen, setImagemFullscreen] = useState<{ url: string; nome: string } | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const carregarIgrejas = async () => {
      try {
        const data = await getIgrejasAtivas();
        setIgrejas(data);
      } catch (error) {
        console.error("Erro ao carregar igrejas:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarIgrejas();
  }, []);

  const sections = useMemo(
    () => (igrejas.length > 0 ? groupByCountry(igrejas) : []),
    [igrejas],
  );

  const scrollToSection = (title: string) => {
    sectionRefs.current[title]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[calc(100vh-200px)]">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 pb-2 bg-gradient-hero bg-clip-text text-transparent">
          Nossas Igrejas
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre a sede mais próxima de você e venha nos visitar
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <IgrejaCardSkeleton />
          <IgrejaCardSkeleton />
          <IgrejaCardSkeleton />
        </div>
      ) : (
        <>
          {/* Shortcut pills */}
          {sections.length > 1 && (
            <div className="flex flex-wrap gap-3 justify-center mb-12">
              {sections.map((section) => (
                  <button
                    key={section.title}
                    onClick={() => scrollToSection(section.title)}
                    className="group/pill flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border/60 bg-card hover:border-primary/50 hover:bg-primary/10 transition-all text-sm font-semibold cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <CountryFlag country={section.title} size={20} />
                    <span className="text-foreground group-hover/pill:text-primary transition-colors">{section.title}</span>
                    <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold">
                      {section.count}
                    </span>
                  </button>
              ))}
            </div>
          )}

          {/* Sections */}
          {sections.map((section) => (
              <div
                key={section.title}
                ref={(el) => { sectionRefs.current[section.title] = el; }}
                className="mb-16 scroll-mt-24"
              >
                {/* Section header */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
                    <CountryFlag country={section.title} size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground leading-tight">
                      {section.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {section.count} {section.count === 1 ? "igreja" : "igrejas"}
                    </p>
                  </div>
                  <div className="flex-1 h-px bg-border/60 ml-4" />
                </div>

                {/* Cards grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.data.map((igreja) => (
                    <IgrejaCard
                      key={igreja.id}
                      igreja={igreja}
                      onImagePress={(url, nome) => setImagemFullscreen({ url, nome })}
                    />
                  ))}
                </div>
              </div>
          ))}
        </>
      )}

      {/* Modal Fullscreen */}
      {imagemFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setImagemFullscreen(null)}
        >
          <button
            onClick={() => setImagemFullscreen(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar imagem"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={imagemFullscreen.url}
            alt={imagemFullscreen.nome}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
