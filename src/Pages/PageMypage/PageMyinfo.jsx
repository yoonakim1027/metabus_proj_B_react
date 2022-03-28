import Myinfo from 'Components/Mypage/Myinfo';
import Sidebar from 'Components/Mypage/Sidebar';
import NewNav from 'Components/Main/NewNav';

function PageMyinfo() {
  return (
    <>
      <NewNav />
      <div>
        <div className="mt-10">
          <Sidebar />
        </div>

        <div>
          <Myinfo />
        </div>
      </div>
    </>
  );
}

export default PageMyinfo;
