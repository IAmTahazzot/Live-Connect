import { Smile } from "lucide-react"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import {useTheme} from 'next-themes'

interface EmojiPickerProps {
    onChange: (value: string) => void;
}

const EmojiPicker = ({
    onChange
                     }: EmojiPickerProps) => {
    const { resolvedTheme } = useTheme()

    return (
        <div>
            <Popover>
               <PopoverTrigger>
                   <Smile size={24} className={'h-[24px] w-[24px] text-zinc-500 dark:text-[#b5bac1] hover:text-zinc-600 dark:hover:text-zinc-300 transition rounded-full flex items-center justify-center'} />
               </PopoverTrigger>
                <PopoverContent
                    side={'right'}
                    sideOffset={40}
                    className={'bg-transparent border-none shadow-none drop-shadow-none mb-16'}
                >
                    <Picker
                        theme={resolvedTheme}
                        data={data}
                        onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default EmojiPicker