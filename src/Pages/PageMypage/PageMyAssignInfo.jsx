import NewNav from 'Components/Main/NewNav';
import MyAssignInfo from 'Components/Mypage/MyAssignInfo';
import Sidebar from 'Components/Mypage/Sidebar';

function PageMyAssignInfo() {
  return (
    <>
      <NewNav />
      <div className="">
        <Sidebar />
        <div className="flex-1">
          <MyAssignInfo />
        </div>
      </div>
      <div className="text-center">
        <button
          className="font-bold text-xl"
          onClick={() => window.history.back()}
        >
          이전으로
        </button>
      </div>
    </>
  );
}

export default PageMyAssignInfo;
