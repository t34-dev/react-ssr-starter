import {FC, PropsWithChildren} from "react";
import s from './index.module.scss'
import {NewFooter, NewHeader} from "@/layouts";

export const NewLayout:FC<PropsWithChildren> = ({children}) => {
  return (
    <div className={s.wrap}>
      <div className={s.wrap__head}><NewHeader/></div>
      <div className={s.wrap__body}>{children}</div>
      <div className={s.wrap__footer}><NewFooter/></div>
    </div>
  )
}
