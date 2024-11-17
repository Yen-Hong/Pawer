import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/services/axios-instance';
import { useRouter } from 'next/router';
// toast訊息套件
import toast, { Toaster } from 'react-hot-toast';

const AuthContext = createContext(null);
AuthContext.displayName = 'AuthContext';

// 建立導出AuthProvider元件
export function AuthProvider({ children }) {
  const router = useRouter();
  const initMemberData = {
    id: 0,
    name: '',
    email: '',
    line_uid: '',
    nickname: '',
    avatar: '',
    google_uid: '',
    google_avatar: '',
    isPetCom: false,
  };

  //定義登入狀態與會員資料(可從此取得會員資料id, name, email, nickname, avatar，若需要更多就撈出id自行去撈db)

  const [auth, setAuth] = useState({
    isAuth: false,
    memberData: initMemberData,
  });

  // 希望導向下一個頁面
  const [nextRoute, setNextRoute] = useState('/member');

  // 會員登出
  const logout = async () => {
    try {
      const res = await axiosInstance.post('/member/logout');
      if (res.data.status === 'success') {
        toast.success('登出成功');
      } else {
        toast.error('登出失敗');
      }
      // 設定回原本的未登入的初始值
      setAuth({
        isAuth: false,
        memberData: initMemberData,
      });
      // 清除購物車localstorage
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error fetching member data:', error);
      return {}; // 返回空物件，表示錯誤時不會崩潰
    }
  };

  // 得到會員個人的資料(登入之後才可以用)
  const getMember = async () => {
    try {
      const res = await axiosInstance.get(`/member`);

      if (res.data.status === 'success') {
        // console.log('取得個人資料成功:', res);
        return res;
      } else {
        console.warn(res.data.message);
        return {};
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      return {}; // 返回空物件，表示錯誤時不會崩潰
    }
  };

  // 隱私頁面路由，未登入時會，檢查後跳轉至登入頁面
  const loginRoute = '/member/login';
  const protectedRoutes = [
    '/member',
    '/member/order',
    '/member/coupon',
    '/member/favorite',
    '/member/join',
    '/member/join/favorite',
    '/member/join/release',
    '/member/blog',
    '/member/blog/favorite',
    '/member/communicator/comReserve',
    '/member/communicator/detail',
    '/member/communicator/edit',
    '/member/communicator/create',
  ];
  // 隱私頁面路由，未登入時會，檢查後跳轉至登入頁面(檢查會員登入狀態)
  const checkState = async () => {
    try {
      const res = await axiosInstance.get(`/member`);
      // console.log('checkstate:', res);

      if (res.data.status === 'success') {
        const nextAuth = {
          isAuth: true,
          memberData: {
            ...auth.memberData,
            id: res.data.memberData.ID ?? '',
            name: res.data.memberData.Name ?? '',
            email: res.data.memberData.eMail ?? '',
            nickname: res.data.memberData.Nickname ?? '',
            avatar: res.data.memberData.Avatar ?? '',
            google_uid: res.data.memberData.google_uid ?? '',
            google_avatar: res.data.memberData.google_avatar ?? '',
            isPetCom: res.data.memberData.isPetCom ?? '',
          },
        };
        setAuth(nextAuth);
      } else {
        // 作隱私路由跳轉
        if (protectedRoutes.includes(router.pathname)) {
          router.push(loginRoute);
          toast.error('無進入權限，請先登入!');
          // 減緩跳轉時間
          // setTimeout(() => {
          //   alert('無進入權限，請先登入!');
          //   router.push(loginRoute);
          // }, 1500);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };
  //隱私頁面路由，未登入時會，檢查後跳轉至登入頁面(每次進入頁面執行檢查)
  useEffect(() => {
    if (router.isReady && !auth.isAuth) {
      checkState();
    }
    // eslint-disable-next-line
  }, [router.isReady, router.pathname]);

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, logout, getMember, initMemberData, nextRoute, setNextRoute }}
    >
      <Toaster />
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
