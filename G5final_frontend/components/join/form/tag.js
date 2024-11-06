import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function Tag({
    label="",
    tagLength=0,
    placeholder="",
    required=false}) {

   const [tags, setTags] = useState([]);
  const [tag, setTag] = useState('');
   const deleteTag = (i) => {
    const dupTags = [...tags];
    dupTags.splice(i, 1);
   setTags(dupTags);
  };

    const handleKeyDown = (e) => {
    const code = e.key;
    // 處理空白字元(字串前後中間都不能有空白)
    const newTag = tag.replace(/\s+/g, '');
    // 這邊要阻止預設行為，不然會觸發表單送出
    if(e.key==="Enter"){
        e.preventDefault();
    }
    // 如果按下的是 Enter 鍵，且 tag 不是空的，就把 tag 加入 tags 陣列
    // 要求使用者輸入的 tag 開頭要是 #，如果不是就不加入
    if ((e.key !== "Enter"||!newTag.startsWith('#')) || tag.length === 0) {
      return;
    }
    // 如果 tags 陣列的長度已經達到自己設定的最大值，就不要再加入新的 tag，並且跳出警告視窗
    if (tags.length >= tagLength) {
        alert(`最多只能輸入${tagLength}個標籤`);
        return;
      }

    // 因為輸入的 tag 都是有 # 的，這裡ㄅ要把 # 去掉
    const tagWithoutHash = newTag.startsWith('#') ? newTag.substring(1) : newTag;
    // 如果 tags 陣列中已經有這個 tag，就不要再加入新的 tag
  if (!tags.includes(tagWithoutHash)) {
    setTags([...tags, tagWithoutHash]);
  }

    // 輸入完 tag 之後，把 tag 清空
    setTimeout(() => {
      setTag('');
    }, 0);
  };

  return (
    <div className="mb-3 tag-input-box">
      <label htmlFor="tag-input" className={`form-label mb-2 ${required ? 'required' : ''}`}>{label}</label>
      <div className="tag-container d-flex">
        {tags.map((tag, i) => {
          return (
            <div key={i} className="tag btn btn-warning rounded-2 mx-1">
              <span className="name text-white ">{tag}</span>
              <span className="ps-1
               icon" onClick={() => deleteTag(i)}>
              &times;
              </span>
            </div>
          );
        })}
        <input
          className='tag-input form-control'
          id="tag-input"
          type="text"
          value={tag}
          placeholder={placeholder}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}