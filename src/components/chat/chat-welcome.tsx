interface ChatWelcomeProps {
  name: string
  type: 'channel' | 'conversation'
}

export default function ChatWelcome({ name, type }: ChatWelcomeProps) {
  return (
    <div className={'px-4 mb-4'}>
      {type === 'channel' && (
        <div
          className={
            'w-[68px] h-[68px] flex items-center justify-center bg-zinc-200 dark:bg-[#41434A] rounded-full dark:text-[#f1f2f5] mb-3'
          }>
          <svg fill="none" height="44" viewBox="0 0 44 44" width="44" xmlns="http://www.w3.org/2000/svg">
            <path
              clipRule="evenodd"
              d="m10.295 38.5c-.31112 0-.54669-.2811-.49232-.5874l1.19742-6.7459h-6.73825c-.31061 0-.54605-.2803-.49251-.5862l.46666-2.6667c.04187-.2392.24963-.4138.49252-.4138h6.91328l1.9433-11h-6.73825c-.31061 0-.54605-.2802-.49251-.5862l.46666-2.6667c.04187-.2392.24963-.4138.49252-.4138h6.91328l1.2284-6.92068c.0424-.23871.2499-.41262.4923-.41262h2.651c.3111 0 .5467.28107.4923.58738l-1.1974 6.74592h11l1.2284-6.92068c.0424-.23871.2499-.41262.4924-.41262h2.651c.3111 0 .5467.28107.4923.58738l-1.1974 6.74592h6.7382c.3106 0 .5461.2803.4925.5862l-.4666 2.6667c-.0419.2392-.2497.4138-.4925.4138h-6.9133l-1.9433 11h6.7382c.3106 0 .5461.2802.4925.5862l-.4666 2.6667c-.0419.2392-.2497.4138-.4925.4138h-6.9133l-1.2284 6.9207c-.0424.2387-.2499.4126-.4923.4126h-2.651c-.3111 0-.5467-.2811-.4924-.5874l1.1975-6.7459h-11l-1.2285 6.9207c-.0423.2387-.2498.4126-.4923.4126zm6.9576-22-1.9434 11h11l1.9434-11z"
              fill="#fff"
              fillRule="evenodd"
            />
          </svg>
        </div>
      )}

      <h3 className={'text-[32px] font-bold text-[#f2f3f5] leading-[1.3]'}>
        {type === 'channel' ? `Welcome to #${name}` : `Welcome to your conversation with ${name}`}
      </h3>
      <p className={'text-zinc-400 dark:text-[#B5BAC1] text-base mt-2 md:mt-1'}>
        {type === 'channel'
          ? `This is the beginning of the #${name} channel.`
          : `This is the beginning of your conversation with ${name}.`}
      </p>
    </div>
  )
}
