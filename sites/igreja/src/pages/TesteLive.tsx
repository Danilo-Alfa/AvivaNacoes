import HlsPlayer from "@/components/HlsPlayer";

export default function TesteLive() {
  const streamUrl = "https://avivanacoes.duckdns.org/live/stream.m3u8";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Teste de Live Stream</h1>

      <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-4">
        <p><strong>URL do Stream:</strong> {streamUrl}</p>
        <p className="text-sm mt-2">
          Esta é uma página de teste simples. Se o player aparecer e funcionar aqui,
          o problema está na lógica da página Live.tsx principal.
        </p>
      </div>

      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <HlsPlayer
          url={streamUrl}
          onReady={() => console.log("Player pronto!")}
          onError={(e) => console.error("Erro no player:", e)}
        />
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Instruções:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Abra o Console do navegador (F12)</li>
          <li>Verifique se aparece "[HlsPlayer] Manifest parsed, stream pronto"</li>
          <li>Se aparecer erro, copie e envie para mim</li>
          <li>Se funcionar aqui mas não na página /live, temos um problema de lógica</li>
        </ol>
      </div>
    </div>
  );
}
