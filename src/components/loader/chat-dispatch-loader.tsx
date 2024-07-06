'use client'

export const ChatDispatchLoader = () => {
  // the probability is 30% of showing media
  const showMedia = Math.random() < 0.3

  // text after media probability 60%
  const textAfterMedia = Math.random() < 0.6
  const textAfterMediaLines = Math.floor(Math.random() * 3 + 1)

  // lines of text content
  const lines = Math.floor(Math.random() * 7 + 1)

  return (
    <div className="pt-7">
      <div className="grid grid-cols-[40px_1fr] gap-x-5 animate-pulse">
        <div>
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--background-modifier-selected,.6))]"></div>
        </div>
        <div className="space-y-3">
          {/* username */}
          <div
            className="h-4 rounded-full bg-[rgba(255,255,255,.4)]"
            style={{
              width: Math.floor(Math.random() * 150 + 30) + 'px',
            }}></div>
          {/* content */}
          <div className="space-y-2">
            {Array.from({ length: lines }).map((_, i) => {
              const words = Math.floor(Math.random() * 9 + 1)

              return (
                <div key={i} className="flex flex-wrap gap-1">
                  {Array.from({ length: words }).map((_, i) => {
                    return (
                      <div
                        key={i}
                        className="h-4 rounded-full bg-[hsl(var(--background-modifier-selected,.6))]"
                        style={{
                          width: Math.floor(Math.random() * 80 + 20) + 'px',
                        }}></div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* media */}
          {showMedia && (
            <div
              className="rounded-md bg-[hsl(var(--background-modifier-selected,.6))]"
              style={{
                width: Math.floor(Math.random() * 300 + 100) + 'px',
                height: Math.floor(Math.random() * 300 + 100) + 'px',
              }}></div>
          )}

          {/* text after media */}
          {textAfterMedia && (
            <div className="space-y-2">
              {Array.from({ length: textAfterMediaLines }).map((_, i) => {
                const words = Math.floor(Math.random() * 7 + 1)

                return (
                  <div key={i} className="flex flex-wrap gap-1">
                    {Array.from({ length: words }).map((_, i) => {
                      return (
                        <div
                          key={i}
                          className="h-4 rounded-full bg-[hsl(var(--background-modifier-selected,.6))]"
                          style={{
                            width: Math.floor(Math.random() * 80 + 20) + 'px',
                          }}></div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
