'use client';

import { ScrollReveal } from '../ScrollReveal';

const chatMessages = [
  { from: 'user', text: 'tasks' },
  {
    from: 'bot',
    text: `<b>Pending Tasks</b>\n\n1. Finalize homepage copy\n   <i>Morris Design Co</i>\n\n2. Send invoice to client\n   <i>Acme Rebrand</i>\n\n3. Review wireframes\n   <i>SaaS Dashboard</i>\n\nReply <b>done N</b> to mark one complete.`,
  },
  { from: 'user', text: 'done 1' },
  {
    from: 'bot',
    text: `Done! "<b>Finalize homepage copy</b>" marked complete.`,
  },
];

export function TelegramFeature() {
  return (
    <section className="py-20 md:py-28 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: description */}
          <ScrollReveal delay={0}>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2AABEE]/10 text-[#2AABEE] text-xs font-medium mb-6">
                <TelegramIcon className="w-4 h-4" />
                Pro Feature
              </div>
              <h2 className="text-3xl font-semibold text-foreground tracking-tight">
                Manage tasks from Telegram.
              </h2>
              <p className="text-base text-muted-foreground mt-3 max-w-lg">
                Check your task list, mark things done, and create new tasks — all without
                leaving Telegram. Perfect for when you&apos;re on the go and need to stay on top of things.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { cmd: 'tasks', desc: 'See your pending task list' },
                  { cmd: 'done 3', desc: 'Mark a task complete' },
                  { cmd: 'add Project: Fix bug', desc: 'Create a task from chat' },
                  { cmd: 'today', desc: 'See what\u2019s due today' },
                ].map((item) => (
                  <div key={item.cmd} className="flex items-start gap-3">
                    <code className="text-xs font-mono bg-muted px-2 py-1 rounded text-foreground whitespace-nowrap mt-0.5">
                      {item.cmd}
                    </code>
                    <span className="text-sm text-muted-foreground">{item.desc}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-muted-foreground mt-8">
                Link your account in Settings — takes 30 seconds.
              </p>
            </div>
          </ScrollReveal>

          {/* Right: mock Telegram chat */}
          <ScrollReveal delay={100}>
            <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-2xl border border-white/5">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <div className="w-9 h-9 rounded-full bg-[#2AABEE] flex items-center justify-center flex-shrink-0">
                  <TelegramIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-white">Pulse Pro Bot</div>
                  <div className="text-xs text-white/50">bot</div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 min-h-[320px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                        msg.from === 'user'
                          ? 'bg-[#2AABEE] text-white rounded-br-sm'
                          : 'bg-white/10 text-white/90 rounded-bl-sm'
                      }`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: msg.text
                            .replace(/\n/g, '<br/>')
                            .replace(/<b>/g, '<strong>')
                            .replace(/<\/b>/g, '</strong>')
                            .replace(/<i>/g, '<em class="text-white/50">')
                            .replace(/<\/i>/g, '</em>'),
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
                <div className="flex-1 bg-white/5 rounded-full px-4 py-2 text-sm text-white/30">
                  Message...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#2AABEE] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
