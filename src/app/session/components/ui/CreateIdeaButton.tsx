interface CreateIdeaButtonProps {
  canCreateIdea: boolean;
  onClick: () => void;
}

export default function CreateIdeaButton({ canCreateIdea, onClick }: CreateIdeaButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canCreateIdea}
      className={`btn btn-primary flex items-center gap-2 ${!canCreateIdea ? 'btn-disabled opacity-50' : ''}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        <path d="M10 2.5a7.5 7.5 0 015.964 12.048l.01.01a.75.75 0 11-1.061 1.06l-.01-.01a7.5 7.5 0 11-4.903-13.108zm.5 4a.75.75 0 00-1.5 0v2.5H6.5a.75.75 0 000 1.5H9v2.5a.75.75 0 001.5 0V10.5h2.5a.75.75 0 000-1.5H10.5V6.5z" />
      </svg>
      Nueva idea
    </button>
  );
}