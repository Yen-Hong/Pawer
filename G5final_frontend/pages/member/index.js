import React, { useState, useEffect } from 'react';
import { BsCamera } from 'react-icons/bs';
import { useAuth } from '@/hooks/use-auth';
import MemberLayout from '@/components/layout/member-layout';
import PageTitle from '@/components/member/page-title/page-title';
import Image from 'next/image';
import toast, { Toaster } from 'react-hot-toast';
// react-datepicker套件
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { zhCN } from 'date-fns/locale';
registerLocale('zhCN', zhCN);
// 套用memberlayout
Member.getLayout = function getLayout(page) {
  return <MemberLayout>{page}</MemberLayout>;
};

export default function Member() {
  // 定義會員資料初始物件
  const initUserProfile = {
    avatar: '',
    account: '',
    name: '',
    nickname: '',
    email: '',
    phone: '',
    gender: '',
    birth: '',
  };

  const { auth, getMember } = useAuth();
  const [userProfile, setUserProfile] = useState(initUserProfile);
  const [hasProfile, setHasProfile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // 初始化會員資料
  const getUserData = async () => {
    const res = await getMember();

    if (res.data.status === 'success') {
      const dbUser = res.data.memberData;
      console.log('dbUser:', dbUser);

      setUserProfile({
        avatar: dbUser.Avatar ?? '',
        account: dbUser.Account ?? '',
        name: dbUser.Name ?? '',
        nickname: dbUser.Nickname ?? '',
        email: dbUser.eMail ?? '',
        phone: dbUser.Phone ?? '',
        gender: dbUser.Gender ?? '',
        birth: dbUser.Birth ?? '',
      });
    }
  };

  // 本頁一開始render後就會設定到會員資料
  useEffect(() => {
    getUserData();
  }, []);

  // 處理input輸入的共用函式，設定回userProfile狀態
  const handleFieldChange = (e) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  // react-datepicker套件
  // 定義要給react-datepicker使用的選擇日期狀態
  const [startDate, setStartDate] = useState(
    // 如果有生日資料就用，沒有就用當天
    userProfile.birth ? new Date(userProfile.birth) : new Date()
  );

  const handleDateChange = (date) => {
    // 日期有選擇onchange 就設定日期狀態
    setStartDate(date);
    // 確認日期有選擇就設定回userprofile狀態
    setUserProfile({
      ...userProfile,
      birth: date ? date.toISOString().split('T')[0] : '',
    });
  };
  // react-datepicker套件 結束

  useEffect(() => {
    if (userProfile.birth) {
      setStartDate(new Date(userProfile.birth));
    }
  }, [userProfile.birth]);

  // 未登入時，不會出現頁面內容
  if (!auth.isAuth) return <></>;

  return (
    <>
      <div className="mb-content">
        <PageTitle title={'會員資料'} subTitle={'Member'} />
        <div className="row mt-4">
          <div className="col-md-6 col-sm-12 d-flex justify-content-center align-items-center">
            <div className="mb-3">
              <div className="profile">
                <div className="picture">
                  <Image
                    className="avatar"
                    src="/member/member-profile.png"
                    alt=""
                    width={150}
                    height={150}
                  />
                </div>
                <button type="file" className="camera-icon">
                  <BsCamera />
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-12">
            <div className="col">
              <div className="mb-3">
                <label htmlFor="account" className="form-label">
                  帳號
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="account"
                  value={userProfile.account}
                  onChange={handleFieldChange}
                  disabled
                />
              </div>
            </div>
            <div className="col">
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  密碼
                </label>
                <div className="w-100">
                  <button type="button" className="btn btn-primary">
                    設定新密碼
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form>
          <div className="row mt-4">
            <div className="col-md-6 col-sm-12">
              <div className="mb-3">
                <label htmlFor="name" className="form-label required">
                  姓名
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={userProfile.name}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="mb-3">
                <label htmlFor="nickname" className="form-label">
                  暱稱
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="nickname"
                  value={userProfile.nickname}
                  onChange={handleFieldChange}
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  信箱
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={userProfile.email}
                  onChange={handleFieldChange}
                  disabled
                />
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  手機
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="account"
                  value={userProfile.phone}
                  onChange={handleFieldChange}
                />
              </div>
            </div>{' '}
            <div className="col-md-6 col-sm-12">
              <div className="mb-3">
                <label htmlFor="gender" className="form-label">
                  性別
                </label>
                <div className="w-100">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="男"
                      checked={userProfile.gender === '男'}
                      onChange={handleFieldChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      男
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="女"
                      checked={userProfile.gender === '女'}
                      onChange={handleFieldChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      女
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      value="不願透露"
                      checked={userProfile.gender === '不願透露'}
                      onChange={handleFieldChange}
                    />
                    <label className="form-check-label" htmlFor="inlineRadio1">
                      不願透露
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="mb-3">
                <label htmlFor="birth" className="form-label">
                  出生日期
                </label>
                <DatePicker
                  locale="zhCN"
                  dateFormat="yyyy-MM-dd"
                  showIcon
                  selected={startDate}
                  onChange={handleDateChange}
                />
              </div>
            </div>
            <div className="col-12 d-flex justify-content-center mt-4">
              <button type="button" className="btn btn-primary">
                儲存
              </button>
            </div>
          </div>
        </form>
      </div>
      {/* 土司訊息視窗用 */}
      <Toaster />
    </>
  );
}
