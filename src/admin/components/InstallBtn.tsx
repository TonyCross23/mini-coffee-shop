import { usePwaInstall } from "../../hooks/usePwaInstall";

export default function InstallButton() {
  const { install, canInstall } = usePwaInstall();

  if (!canInstall) return null;

  return (
    <button
      onClick={install}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Install Mini Coffee Shop
    </button>
  );
}
