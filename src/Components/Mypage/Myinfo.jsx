import { useApiAxios } from 'api/base';
import { useEffect, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import Sidebar from 'Components/Mypage/Sidebar';
import LoadingIndicator from 'LoadingIndicator';
import { useNavigate } from 'react-router-dom';
import './Mypage.css';

function Myinfo() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  //데이터 GET요청 : 조회 목적
  const [{ data: userData, loading, error }, refetch] = useApiAxios(
    {
      url: `/accounts/api/users/${auth.userID}/`,
      method: 'GET',
    },
    { manual: true },
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  const [{ loading: deleteLoading, error: deleteError }, deleteUser] =
    useApiAxios(
      {
        url: `/accounts/api/users/${auth.userID}/`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${auth.access}`,
        },
      },
      { manual: true },
    );

  const handleDelete = () => {
    if (window.confirm('정말 탈퇴 하실 건가요?😭')) {
      deleteUser().then(() => {
        navigate('/');
        window.location.reload();
        logout();
      });
    }
  };

  // 처음 화면 로딩시 최상단으로 로딩
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  //-------------

  return (
    <>
      <div className="header flex flex-wrap justify-center" id="topLoc">
        <div className="mx-5 mypage_header rounded-xl overflow-hidden sm:px-20 my-10 lg:w-2/3 md:w-5/6 sm:w-full xs:w-full">
          <blockquote className="xs:mt-2 md:mt-5 xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl xs:text-xl mb-3 font-semibold italic text-center text-slate-900">
            <span className="mt-7 mb-3 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-blue-900 relative inline-block">
              <span className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl xs:text-xl relative text-white">
                " 내 회원정보 "
              </span>
            </span>
          </blockquote>
          {/* 로딩 에러 */}
          {loading && (
            <LoadingIndicator>&nbsp;&nbsp;로딩 중...</LoadingIndicator>
          )}
          {error && (
            <>
              <p className="text-red-400">
                &nbsp;&nbsp; ! 로딩 중 에러가 발생했습니다. !
              </p>
            </>
          )}
          {error?.response?.status === 401 && (
            <div className="text-red-400">
              조회에 실패했습니다. 정보가 없습니다.
            </div>
          )}

          <div className="mb-5 overflow-hidden">
            <table className="mb-5 mt-3 border text-center min-w-full divide-y divide-gray-200">
              <tbody>
                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center  font-bold text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <td className="border">{userData?.name}</td>
                </tr>

                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center  font-bold text-gray-500 uppercase tracking-wider">
                    아이디
                  </th>
                  <td className="border">{userData?.userID}</td>
                </tr>

                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center  font-bold text-gray-500 uppercase tracking-wider">
                    닉네임
                  </th>
                  <td className="border">{userData?.nickname}</td>
                </tr>

                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">
                    이메일
                  </th>
                  <td className="border">{userData?.email}</td>
                </tr>

                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">
                    연락처
                  </th>
                  <td className="border">{userData?.phone_number}</td>
                </tr>

                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">
                    거주지
                  </th>
                  <td className="border">{userData?.region}</td>
                </tr>

                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">
                    비밀번호 퀴즈
                  </th>
                  <td className="border">{userData?.password_quiz}</td>
                </tr>

                <tr>
                  <th className="xl:text-xl lg:text-xl md:text-m sm:text-m xs:text-sm border border-slate-200 bg-gray-50 px-4 py-3 text-center font-bold text-gray-500 uppercase tracking-wider">
                    퀴즈 정답
                  </th>
                  <td className="border">{userData?.password_quiz_answer}</td>
                </tr>
              </tbody>
            </table>

            <div className="text-right">
              <a
                className="rounded-xl a border p-3"
                href="/mypage/userinfo/edit/"
              >
                &nbsp;회원정보 수정&nbsp;
              </a>
              <button
                className="rounded-xl a border ml-10 p-3 mr-5"
                onClick={() => handleDelete()}
              >
                &nbsp;회원 탈퇴&nbsp;
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Myinfo;
