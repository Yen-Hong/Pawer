import React, { useState, useEffect } from 'react';
import PageTitle from '@/components/member/page-title/page-title';
import Image from 'next/image';
import { usePagination } from '@/hooks/usePagination';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
export default function ComDetail(props) {
  const { auth } = useAuth();
  const id = auth?.memberData?.id;
  const processData = (items) => {
    if (!id) return [];
    return items.filter((item) => item.MemberID === id);
  };
  const { nowPageItems } = usePagination({
    url: 'http://localhost:3005/api/pet',
    processData,
  });
  useEffect(() => {
    if (nowPageItems >= 1) {
      console.log(nowPageItems[0].Status);
    }
  }, [nowPageItems]);

  // 一鍵刊登功能
  const [isPublished, setIsPublished] = useState(false);
  function togglePublish() {
    // 更新狀態
    const newStatus = !isPublished;
    setIsPublished(newStatus);
    // 發送狀態至後端
    try {
      fetch('http://localhost:3005/api/pet/setStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          ID: id,
        }),
      }).then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
      });
    } catch (err) {
      console.error('錯誤：', err);
    }
  }
  return (
    <>
      {nowPageItems.map((mydata) => (
        <React.Fragment key={mydata.ID}>
          {/* 第一張卡 */}
          <div className="sec1 p-4">
            {/* 標題 */}
            <div className="d-flex justify-content-between">
              <PageTitle title={'溝通師資料'} subTitle={'Communicator'} />
              <div>
                {/* 上架開關按鈕 */}
                <button
                  className={`btn mx-3 ${
                    isPublished ? 'btn-success' : 'btn-secondary'
                  }`}
                  onClick={togglePublish}
                >
                  {isPublished ? '已刊登' : '未刊登'}
                </button>
                <Link
                  href={'/member/communicator/edit'}
                  className="btn btn-primary"
                >
                  編輯
                </Link>
              </div>
            </div>
            {/* 主介紹 */}
            <div className="row content-1">
              <div className="col-12 col-md-4 d-flex justify-content-center align-items-center">
                <div className="avatar d-flex justify-content-center align-items-center">
                  {mydata.Img ? (
                    <>
                      <Image
                        alt="avatar"
                        src={`http://localhost:3005/pet/${mydata.Img}`}
                        width={200}
                        height={200}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        priority
                      />
                    </>
                  ) : (
                    <>
                      <Image
                        alt="avatar"
                        src={`http://localhost:3005/pet/avatar-default.png`}
                        width={200}
                        height={200}
                        style={{ borderRadius: '50%', objectFit: 'cover' }}
                        priority
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-8">
                <div className="row my-4">
                  <div className="col-4">溝通師刊登名稱</div>
                  <div className="col">{mydata.Name}</div>
                </div>
                <div className="row my-4">
                  <div className="col-4">服務項目</div>
                  <div className="col">{mydata.Service}</div>
                </div>
                <div className="row my-4">
                  <div className="col-4">Email</div>
                  <div className="col">{mydata.Email}</div>
                </div>
                <div className="row my-4">
                  <div className="col-4">預約費用</div>
                  <div className="col">{mydata.Fee}</div>
                </div>
                <div className="row my-4">
                  <div className="col-4">進行方式</div>
                  <div className="col">
                    {mydata.Approach
                      ? mydata.Approach.split(',').map((v, i) => {
                          return (
                            <p key={i} className="way mx-1">
                              {v}
                            </p>
                          );
                        })
                      : ''}
                  </div>
                </div>
                <div className="row my-4">
                  <div className="col-4">證書編號</div>
                  <div className="col">{mydata.Certificateid}</div>
                </div>
              </div>
            </div>
          </div>
          {/* 第二張卡 */}
          <div className="sec2 mt-3">
            <h3 className="text-center mt-3 content-title">介紹</h3>
            <hr />
            {mydata.Introduction}
          </div>
        </React.Fragment>
      ))}
    </>
  );
}
