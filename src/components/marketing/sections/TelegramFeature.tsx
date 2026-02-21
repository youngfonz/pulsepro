'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ScrollReveal } from '../ScrollReveal';

import type { ReactNode } from 'react';

const chatMessages: { from: string; content: ReactNode }[] = [
  { from: 'user', content: 'tasks' },
  {
    from: 'bot',
    content: (
      <>
        <strong>Pending Tasks</strong><br /><br />
        1. Finalize homepage copy<br />
        <em className="opacity-50">Morris Design Co</em><br /><br />
        2. Send invoice to client<br />
        <em className="opacity-50">Acme Rebrand</em><br /><br />
        Reply <strong>done N</strong> to mark one complete.
      </>
    ),
  },
  { from: 'user', content: 'done 1' },
  {
    from: 'bot',
    content: (
      <>Done! &ldquo;<strong>Finalize homepage copy</strong>&rdquo; marked complete.</>
    ),
  },
];

const features = [
  {
    id: 'telegram',
    badge: 'Telegram Bot',
    badgeColor: 'bg-[#2AABEE]/10 text-[#2AABEE]',
    title: 'Manage tasks from Telegram.',
    description:
      'Check your task list, mark things done, and create new tasks \u2014 all without leaving Telegram. Perfect for when you\u2019re on the go.',
    bullets: [
      'View pending tasks and deadlines',
      'Mark tasks complete with a message',
      'Create new tasks from any chat',
    ],
  },
  {
    id: 'voice',
    badge: 'Voice Input',
    badgeColor: 'bg-primary/10 text-primary',
    title: 'Speak your tasks into existence.',
    description:
      'Click the mic, say what you need to do, and it\u2019s captured instantly. Works in task creation, project notes, and descriptions.',
    bullets: [
      'Add tasks hands-free while multitasking',
      'Capture ideas the moment they hit',
      'Works in any modern browser \u2014 no install',
    ],
  },
  {
    id: 'insights',
    badge: 'AI Insights',
    badgeColor: 'bg-violet-500/10 text-violet-500',
    title: 'Your projects, analyzed.',
    description:
      'AI scans your projects, deadlines, and task patterns to surface what needs attention \u2014 no digging through data.',
    bullets: [
      'Flags overdue tasks and at-risk projects',
      'Spots deadline clusters before they pile up',
      'Highlights progress so you know what\u2019s working',
    ],
  },
];

export function TelegramFeature() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const cycle = useCallback(() => {
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % features.length);
      setVisible(true);
    }, 350);
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(cycle, 6000);
  }, [cycle]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startInterval]);

  const handleTab = (i: number) => {
    if (i === active) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
    timeoutRef.current = setTimeout(() => {
      setActive(i);
      setVisible(true);
    }, 350);
    startInterval();
  };

  const feature = features[active];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section heading */}
        <ScrollReveal delay={0}>
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              More ways to stay on top
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              Manage your work from anywhere — through Telegram, voice, or AI-powered analysis.
            </p>
          </div>
        </ScrollReveal>

        {/* Tabs */}
        <ScrollReveal delay={100}>
          <div className="flex justify-center mb-14">
            <div className="inline-flex gap-1 bg-muted/50 rounded-full p-1">
              {features.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => handleTab(i)}
                  className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap ${
                    i === active
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f.badge}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div
          className="transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: description */}
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${feature.badgeColor}`}
              >
                {feature.id === 'telegram' && <TelegramIcon className="w-4 h-4" />}
                {feature.id === 'voice' && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                )}
                {feature.id === 'insights' && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                )}
                {feature.badge}
              </div>

              <h3 className="text-3xl font-semibold text-foreground tracking-tight">
                {feature.title}
              </h3>
              <p className="text-base text-muted-foreground mt-3 max-w-lg">
                {feature.description}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {feature.bullets.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: visual */}
            <div>
              {feature.id === 'telegram' && <TelegramMock />}
              {feature.id === 'voice' && <VoiceMock />}
              {feature.id === 'insights' && <InsightsMock />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TelegramMock() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="w-9 h-9 rounded-full bg-[#2AABEE] flex items-center justify-center flex-shrink-0">
          <TelegramIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-sm font-medium text-card-foreground">Pulse Pro Bot</div>
          <div className="text-xs text-muted-foreground">bot</div>
        </div>
      </div>

      <div className="p-4 space-y-3 min-h-[300px]">
        {chatMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.from === 'user'
                  ? 'bg-[#2AABEE] text-white rounded-br-sm'
                  : 'bg-muted text-card-foreground rounded-bl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <div className="flex-1 bg-muted rounded-full px-4 py-2 text-sm text-muted-foreground">
          Message...
        </div>
        <div className="w-8 h-8 rounded-full bg-[#2AABEE] flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function VoiceMock() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-2xl border border-border p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
          Listening
        </span>
      </div>

      <div className="flex items-center justify-center gap-[3px] h-16">
        {Array.from({ length: 40 }).map((_, i) => {
          const center = 20;
          const distance = Math.abs(i - center) / center;
          const base = 30 + (1 - distance) * 60;
          const variation = Math.sin(i * 0.7) * 15 + Math.cos(i * 1.3) * 10;
          const height = Math.max(15, Math.min(95, base + variation));
          return (
            <div
              key={i}
              className="w-[3px] rounded-full bg-primary/30"
              style={{
                height: `${height}%`,
                animationName: 'waveform-pulse',
                animationDuration: `${0.8 + (i % 5) * 0.2}s`,
                animationTimingFunction: 'ease-in-out',
                animationIterationCount: 'infinite',
                animationDirection: 'alternate',
                animationDelay: `${i * 0.05}s`,
              }}
            />
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-sm text-foreground">
          &ldquo;Follow up with Sarah about the brand guidelines by Friday&rdquo;
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Transcribed to task title
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 mt-5 text-muted-foreground text-xs">
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Click</kbd>
          to start
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground font-mono text-[10px]">Click</kbd>
          to stop
        </span>
      </div>

      <style jsx>{`
        @keyframes waveform-pulse {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.4); }
        }
      `}</style>
    </div>
  );
}

function InsightsMock() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-2xl border border-border">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
        <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <span className="text-sm font-medium text-card-foreground">Insights</span>
        <span className="text-[10px] text-muted-foreground ml-auto">Updated 2 min ago</span>
      </div>

      <div className="divide-y divide-border">
        {[
          { dot: 'bg-rose-500', text: 'Acme Rebrand has 3 overdue tasks \u2014 prioritize before Friday' },
          { dot: 'bg-amber-500', text: "Morris Design Co hasn\u2019t been updated in 12 days" },
          { dot: 'bg-blue-500', text: '2 high-priority tasks due tomorrow \u2014 start with wireframes' },
        ].map((insight) => (
          <div
            key={insight.text}
            className="flex items-center gap-3 px-5 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${insight.dot}`} />
            <p className="text-sm text-card-foreground flex-1">{insight.text}</p>
            <svg className="w-4 h-4 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>

      <div className="px-5 py-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
          </svg>
          3 projects analyzed
        </div>
      </div>
    </div>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
