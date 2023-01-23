import React, { useState } from 'react'
import Modal from 'Shared/Modal'
import Field from 'Shared/Field'
import Button from 'Shared/Button'
import style from './style.module.scss'

type Props = {
  close: () => any
}

export default ({ close }: Props) => {
  const [curPassword, setCurPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [ConPassword, setConPassword] = useState('')

  return <Modal
      className={style.modal}
      title='Change Password'
      close={close}
      actions={
        <Button primary onClick={close}>Confirm</Button>
      }
    >
      <div className={style.modalContent}>
        <Field label='Current Password' type='password' value={curPassword} setValue={(str: string) => setCurPassword(str)}  />
        <Field label='New password' type='password' value={newPassword} setValue={(str: string) => setNewPassword(str)}  />
        <Field label='Confirm new password' type='password' value={ConPassword} setValue={(str: string) => setConPassword(str)}  />
      </div>
    </Modal>
}
  
