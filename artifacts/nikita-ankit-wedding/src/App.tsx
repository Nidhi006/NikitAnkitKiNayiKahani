import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

type ChapterStage = 'intro' | 'reveal' | 'resting';

type ParticleStyle = CSSProperties & {
  '--x': string;
  '--y': string;
  '--s': string;
  '--d': string;
  '--delay': string;
  '--sx': string;
  '--sy': string;
  '--o': number;
};

function DustField() {
  const particles = useMemo<ParticleStyle[]>(
    () =>
      Array.from({ length: 44 }, (_, index) => {
        const x = (index * 47 + 9) % 100;
        const y = (index * 71 + 13) % 100;
        const size = 1 + ((index * 3) % 3);
        return {
          '--x': `${x}%`,
          '--y': `${y}%`,
          '--s': `${size}px`,
          '--d': `${4.5 + (index % 5) * 0.8}s`,
          '--delay': `${(index % 11) * 0.22}s`,
          '--sx': `${((index % 7) - 3) * 14}px`,
          '--sy': `${((index % 5) - 2) * 18}px`,
          '--o': 0.18 + (index % 5) * 0.1,
        };
      }),
    [],
  );

  return (
    <div className="dust-field" aria-hidden="true">
      {particles.map((style, index) => (
        <span className="dust-particle" key={index} style={style} />
      ))}
    </div>
  );
}

function InvitationCover({
  continued,
  onContinue,
}: {
  continued: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="book-stage">
      <div className="book-aura" aria-hidden="true" />
      <div className="book-cover" data-testid="card-invitation-cover">
        <div className="book-ornament book-ornament--top" aria-hidden="true">
          ॥ &nbsp; ॥ &nbsp; ॥
        </div>
        <div className="book-label">A new chapter · page one</div>
        <h1 className="book-title" data-testid="text-couple-names">
          <span>Nikita</span>
          <span className="ampersand">&amp;</span>
          <span>Ankit</span>
        </h1>
        <p className="book-subtitle">
          Two hearts, one home,<br />
          a thousand stories ahead.
        </p>
        <div className="book-meta">
          <span>Jaipur</span>
          <span>2024</span>
          <span>With love</span>
        </div>
        {!continued ? (
          <button
            className="continue-button"
            type="button"
            onClick={onContinue}
            data-testid="button-continue-invitation"
            aria-label="Continue to the invitation"
          >
            Continue the story
          </button>
        ) : (
          <p className="book-subtitle" style={{ marginTop: '1.9rem' }}>
            Keep this page close.
          </p>
        )}
        <div className="book-ornament book-ornament--bottom" aria-hidden="true">
          ॥ &nbsp; ॥
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [stage, setStage] = useState<ChapterStage>('intro');
  const [continued, setContinued] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setStage('reveal');
      return undefined;
    }
    if (stage === 'intro') {
      const revealTimer = window.setTimeout(() => setStage('reveal'), 5600);
      return () => window.clearTimeout(revealTimer);
    }
    if (stage === 'reveal') {
      const restingTimer = window.setTimeout(() => setStage('resting'), 14000);
      return () => window.clearTimeout(restingTimer);
    }
    return undefined;
  }, [reducedMotion, stage]);

  const skipOpening = () => {
    setContinued(false);
    setStage('reveal');
  };

  const replayOpening = () => {
    setContinued(false);
    setStage('intro');
  };

  const continueStory = () => {
    setContinued(true);
    setStage('resting');
  };

  const liveMessage =
    stage === 'intro'
      ? 'Opening sequence. Golden dust is gathering.'
      : stage === 'reveal'
        ? 'The invitation has opened. Nikita and Ankit invite you to continue.'
        : continued
          ? 'The first page is yours to keep. More of their story follows.'
          : 'The invitation is resting, ready when you are.';

  return (
    <main className="wedding-shell" data-testid="wedding-experience">
      <div className="screen-reader-status" role="status" aria-live="polite">
        {liveMessage}
      </div>

      {stage === 'intro' ? (
        <section
          className="chapter-view chapter-view--intro"
          aria-label="Opening sequence"
          data-testid="section-opening"
        >
          <div className="ambient-architecture" aria-hidden="true" />
          <DustField />
          <div className="intro-content">
            <p className="intro-kicker">A story begins in Jaipur</p>
            <p className="ganesha-mark" data-testid="text-ganesha-mantra">
              ॥ श्री गणेशाय नमः ॥
            </p>
            <div className="intro-rule" aria-hidden="true" />
          </div>
          <button
            type="button"
            className="skip-button"
            onClick={skipOpening}
            data-testid="button-skip-opening"
            aria-label="Skip the opening sequence"
          >
            Skip opening
          </button>
        </section>
      ) : (
        <section
          className={`chapter-view chapter-view--${stage}`}
          aria-label="Nikita and Ankit's wedding invitation"
          data-testid={`section-${stage}`}
        >
          <InvitationCover continued={continued} onContinue={continueStory} />
          <p className="resting-message" data-testid="text-resting-message">
            {continued ? (
              <>
                <span>Chapter one is waiting to be written.</span>
                <strong>Thank you for entering their story.</strong>
              </>
            ) : (
              <>
                <span>A little ceremony, made just for you.</span>
                <strong>Tap when the moment feels right.</strong>
              </>
            )}
          </p>
          <button
            type="button"
            className="replay-button"
            onClick={replayOpening}
            data-testid="button-replay-opening"
            aria-label="Replay the opening sequence"
          >
            Replay opening
          </button>
        </section>
      )}
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
