'use client'

import { cn } from '@/lib/utils'
import React, { useState } from 'react'

type SwitchProps = {
  id: string
  inputAttrs: {}
  isChecked?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const Switch = ({ id, inputAttrs, isChecked = false, onChange }: SwitchProps) => {
  const [checked, setChecked] = useState(isChecked)
  const [holding, setHolding] = useState(false)
  const paths = {
    inactive: [
      'M5.13231 6.72963L6.7233 5.13864L14.855 13.2704L13.264 14.8614L5.13231 6.72963Z',
      'M13.2704 5.13864L14.8614 6.72963L6.72963 14.8614L5.13864 13.2704L13.2704 5.13864Z',
    ],

    active: [
      'M7.89561 14.8538L6.30462 13.2629L14.3099 5.25755L15.9009 6.84854L7.89561 14.8538Z',
      'M4.08643 11.0903L5.67742 9.49929L9.4485 13.2704L7.85751 14.8614L4.08643 11.0903Z',
    ],

    changing: [
      'M6.56666 11.0013L6.56666 8.96683L13.5667 8.96683L13.5667 11.0013L6.56666 11.0013Z',
      'M13.5582 8.96683L13.5582 11.0013L6.56192 11.0013L6.56192 8.96683L13.5582 8.96683Z',
    ],
  }

  return (
    <label htmlFor={id}>
      <div className="hidden">
        <input
          {...inputAttrs}
          type="checkbox"
          id={id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setChecked(e.target.checked)
            if (onChange) onChange(e)
          }}
        />
      </div>
      <div
        className={cn(
          'w-10 h-6 rounded-full duration-300 transition-colors cursor-pointer p-1 relative',
          checked ? 'bg-emerald-500' : 'bg-gray-500'
        )}
        onMouseDown={() => setHolding(true)}
        onMouseUp={() => setHolding(false)}
        onMouseLeave={() => setHolding(false)}>
        <div
          className={cn(
            'absolute h-4 rounded-full bg-white duration-200 transition-all',
            holding ? 'w-6' : 'w-4',
            !checked ? 'left-1' : holding ? 'left-[calc(100%-28px)]' : 'left-[calc(100%-20px)]'
          )}>
          <svg viewBox="0 0 20 20" fill="none">
            <path
              className={cn('duration-150 transition-all', checked ? 'fill-emerald-500' : 'fill-gray-500')}
              d={holding ? paths.changing[0] : checked ? paths.active[0] : paths.inactive[0]}></path>
            <path
              className={cn('duration-150 transition-all', checked ? 'fill-emerald-500' : 'fill-gray-500')}
              d={holding ? paths.changing[1] : checked ? paths.active[1] : paths.inactive[1]}></path>
          </svg>
        </div>
      </div>
    </label>
  )
}
