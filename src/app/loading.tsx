'use client'

const amazingFacts: { text: string; deprecated: boolean }[] = [
  {
    text: 'You are amazing',
    deprecated: false,
  },
  {
    text: 'I love you 💞',
    deprecated: false,
  },
  {
    text: 'You are beautiful',
    deprecated: false,
  },
  {
    text: 'You are handsome a person 😍',
    deprecated: false,
  },
  {
    text: 'You are a good person',
    deprecated: false,
  },
  {
    text: 'You love me 💕',
    deprecated: false,
  },
  {
    text: 'I think about you all the time',
    deprecated: false,
  },
  {
    text: 'I love you so much',
    deprecated: false,
  },
]

const Loading = () => {
  // get a non-deprecated fact and don't repeat the last one
  let randomFact = amazingFacts.filter(fact => !fact.deprecated)[Math.floor(Math.random() * (amazingFacts.length - 1))]
    .text

  return (
    <div className={'h-full min-h-screen flex items-center justify-center w-full'}>
      <div className={'text-center mt-8'}>
        <video className={'mx-auto mb-2 w-56'} muted={true} autoPlay={true} loop={true} controls={false}>
          <source src={'/assets/video/spinner.webm'} type={'video/webm'} />
          <source src={'/assets/video/spinner.mp4'} type={'video/mp4'} />
          <img src="/assets/logo.png" alt="brand" />
        </video>

        <p className={'text-[12px] uppercase text-[#f2f3f5] font-semibold mb-2'}>Did you know</p>
        <p className={'text-[#DBDEE1] font-base leading-[1.35] max-w-[300px] break-words'}>{randomFact}</p>
      </div>
    </div>
  )
}

export default Loading
