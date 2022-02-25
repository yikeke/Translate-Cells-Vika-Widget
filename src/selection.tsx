import { FieldType, useField, useRecords, useActiveCell, useRecord, useActiveViewId} from '@vikadata/widget-sdk';
import React, { useState } from 'react';
import * as $ from "jquery";
import CryptoJS from './CryptoJS.js';


export const Selection: React.FC = () => {
  const viewId = useActiveViewId();
  const activeCell = useActiveCell();
  const activeField = useField(activeCell?.fieldId!)
  const activeRecord = useRecord(activeCell?.recordId);
  var [translationYoudao, setTranslationYoudao] = useState<string>();
  var [translationDeepl, setTranslationDeepl] = useState<string>();
  var query = activeRecord?.getCellValueString(activeCell?.fieldId) || '';
  // 请填写有道翻译所需要的参数 appKey 和 key
  const appKey = ''; 
  const key = '';//注意：暴露appSecret，有被盗用造成损失的风险
  const salt = (new Date).getTime();
  const curtime = Math.round(new Date().getTime()/1000);
  const from = 'zh-CHS';
  const to = 'en';
  // 请填写 deepl 翻译所需要的参数
  const authKey = ''
  const source_lang = 'ZH';
  const target_lang = 'EN-US';

  if(activeCell){
    switch (activeField?.type) {
        case FieldType.SingleText:
            //单行文本
            if (truncate(query).length == 0){
              // console.log("query 长度", truncate(query).length)
              break;
            }else{
              youdaoTranslate(appKey, key, salt, curtime, query, from, to).then(res => {
                setTranslationYoudao(res)
              }).catch;
              deeplTranslate(authKey, query, source_lang, target_lang).then(res => {
                setTranslationDeepl(res)
              }).catch;
              break;
            }
        case FieldType.Text:
            //多行文本
            if (truncate(query).length == 0){
              // console.log("query 长度", truncate(query).length)
              break;
            }else{
              youdaoTranslate(appKey, key, salt, curtime, query, from, to).then(res => {
                setTranslationYoudao(res)
              }).catch;
              deeplTranslate(authKey, query, source_lang, target_lang).then(res => {
                setTranslationDeepl(res)
              }).catch;
              break;
            }
        default:
          // setTranslationYoudao({translationYoudao:"暂不支持非文本类型"});
          break;
    }
  }
  // const query = activeCell?.fieldId && activeRecord?.getCellValueString(activeCell?.fieldId) || '_';
  // console.log("query", query)
  // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'

  return (
    <div>
      <h3>请先在表格中选择一个要翻译的单元格</h3>
      <small><i>注：目前只支持翻译单行/多行文本列的单元格，只支持中译英。</i></small>
      <hr/>
      <p>激活的单元格：<br />{query}</p>
      <p>有道翻译：<br />{translationYoudao}</p>
      <p>DeepL 翻译：<br />{translationDeepl} </p>
      {/* <button onclick="copyToClip('内容');"> Copy </button> */}
      {/* <a href="javascript: ;"><button class="btn" data-clipboard-text="copyValue">复制</button></a> */}
    </div>
  );
};

function youdaoTranslate(appKey, key, salt, curtime, query, from, to) {
  const str1 = appKey + truncate(query) + salt + curtime + key;
  //console.log('---',str1);
  const sign = CryptoJS.SHA256(str1).toString(CryptoJS.enc.Hex);
  // alert("success");
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://openapi.youdao.com/api',
      type: 'post',
      dataType: 'jsonp',
      data: {
          q: query,
          appKey: appKey,
          salt: salt,
          from: from,
          to: to,
          sign: sign,
          signType: "v3",
          curtime: curtime,
      },
      success: function(data) {
        // console.log("youdao 调用", data.translation[0]);
        resolve(data.translation[0]);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("error: ", XMLHttpRequest.statusText, textStatus, errorThrown);
        reject(0);
      },
    });
  }) 
};

function truncate(q){
    const len = q.length;
    // console.log("trucate 后的 q", q);
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
};

function deeplTranslate(authKey, query, source_lang, target_lang) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: 'https://api-free.deepl.com/v2/translate',
      type: 'get',
      dataType: 'json',
      data: {
          text: query,
          auth_key: authKey,
          source_lang: source_lang,
          target_lang: target_lang,
      },
      success: function(data) {
        // console.log("deepl 调用", data.translations[0]["text"]);
        resolve(data.translations[0]["text"]);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        console.log("error: ", XMLHttpRequest.statusText, textStatus, errorThrown);
        reject(0);
      },
    });
  }) 
};

