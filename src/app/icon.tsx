import { ImageResponse } from 'next/server'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '50%',
        }}>
        L
      </div>
    ),
    {
      width: 32,
      height: 32,
    }
  )
}
