import { useState, useContext } from 'react';
import { useAlert } from 'react-alert'
import _ from 'lodash'

import { requestApi } from './../api'
import style from './MainContent.module.css'
import { LoginContext } from './../App'

export const MainContent = ({ url }) => {
  const loginned = useContext(LoginContext)

  const path = url ? `${url.hostname}${url.pathname}?` : ''
  const formattedUrls = url ?
    _.zip(Array.from(url.searchParams.keys()), Array.from(url.searchParams.values()))
      .map(([ key, value ]) => ({ key, value })) : []
  return (
    <div className={style.main}>
      { loginned || (
        <p className={style.loginAlert}>ログインしていません。<br />クエリストリングは「作成者なし」で作られます。</p>
      )}
      {formattedUrls.map(formattedUrl => <Query key={path + formattedUrl.key} formattedUrl={formattedUrl} path={path}/>)}
    </div>
  )
}

const Query = ({ formattedUrl, path }) => {
  const [description, setDescription] = useState(`[${formattedUrl.value}]`)
  const handleDescriptionInput = event => {
    setDescription(event.target.value)
  }
  const alert = useAlert()
  const handleClick = e => {
    const body = { path: path.replace(/\?$/, ''), key: formattedUrl.key, description }
    requestApi('/query_strings', 'POST', body).then(r => {
      alert.success('作成しました')
      setDescription('')
    }).catch(r => {
      alert.error(r.error)
    })
  }
  return (
    <div className={style.query}>
      <div className={style.queryPath}>{path}</div>
      <div className={style.queryKey}>{formattedUrl.key}</div>
      <textarea onChange={handleDescriptionInput} className={style.queryDescription} value={description}/>
      <button className={style.querySave} onClick={handleClick}>create</button>
    </div>
  )
}
