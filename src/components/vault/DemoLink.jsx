import { useNavigate } from 'react-router-dom';
import { getDemoForNote } from '../../utils/demoMapping';

export default function DemoLink({ noteId }) {
  const navigate = useNavigate();
  const demo = getDemoForNote(noteId);
  
  if (!demo) return null;

  const handleClick = () => {
    navigate(`/explore/${demo.section}`);
  };

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-accent mb-1">
            Interactive Demo Available
          </h3>
          <p className="text-sm text-secondary leading-relaxed mb-3">
            {demo.description}
          </p>
          
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent/80 text-background rounded-md transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Try Interactive Demo
          </button>
          
          {demo.simulations && demo.simulations.length > 1 && (
            <div className="mt-2 text-xs text-secondary">
              Includes {demo.simulations.length} simulations
            </div>
          )}
        </div>
      </div>
    </div>
  );
}