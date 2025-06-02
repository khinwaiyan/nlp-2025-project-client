import { Button } from "./ui/button";

export const Header = () => {
  return (
    <header className="bg-gray-950 h-16 w-full text-white flex items-center justify-between px-10">
      <div>BioGPT</div>
      <a
        href="https://deepmind.google/science/alphafold/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="default">Try AlphaFold</Button>
      </a>
    </header>
  );
};
