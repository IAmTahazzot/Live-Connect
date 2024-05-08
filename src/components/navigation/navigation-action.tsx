'use client'

import {Plus} from "lucide-react";
import {ActionTooltip} from "@/components/action-tooltip";
import {MODAL_TYPES, useModal} from "@/hooks/use-modal-store";

const NavigationAction = () =>  {
    const { onOpen} = useModal();

    return (
        <div>
            <ActionTooltip
                side={'right'}
                align={'center'}
                label={"Add a server"}>
                <button
                    onClick={() => onOpen(MODAL_TYPES.CREATE_SERVER)}
                    className={'group flex items-center'}>
                    <div className={'flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-[--background-chat] group-hover:bg-emerald-500'}>
                        <Plus className={'group-hover:text-white transition text-emerald-500'}
                              size={24} />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    )
}

export default NavigationAction;