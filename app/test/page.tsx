'use client'

import {Button} from "@/app/ui/button";
import {useState} from "react";
import clsx from "clsx";
import {Utf8ArrayToStr} from "@/app/lib/utf";

export default function Page() {
  const [state, setState] = useState('');
  const [q, setQ] = useState('');

  const onReq = async function () {
    try {
      const res = await fetch(`/api?q=${q}`, {method: 'GET'});
      if (res.status === 500 && res.statusText === 'fail') {
        const {message} = await res.json();
        alert(message);
        return;
      }
      const reader = res.body!.getReader();
      let resultVal = '';
      while (true) {
        const {done, value} = await reader.read();
        if (done || !value) break;
        resultVal += Utf8ArrayToStr(value);
        setState(resultVal);
      }
    } catch (e: any) {
      console.log('eee', e)
      alert(e?.message || '未知异常')
    }
  }

  return <form className="shadow rounded-lg p-2" onSubmit={e => e.preventDefault()}>
    <div className="w-96 rounded-lg bg-gray-50 px-5 pb-4 pt-8 space-y-4">
      <input type="text" id="q" name="q" placeholder="请输入……" className="w-full rounded" value={q}
             onChange={e => setQ(e.target.value)}/>
      <div className="w-full">
        <Button className="h-8 w-20 justify-center ml-auto" onClick={onReq}>请求</Button>
      </div>
      <div
        className={clsx("shadow rounded-lg p-2 bg-white w-full break-all max-h-96 overflow-y-auto", {'hidden': !state})}>
        {state}
      </div>
    </div>
  </form>
}