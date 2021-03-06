import { useApiAxios } from 'api/base';
import { useState, useEffect, useCallback } from 'react';
import ReviewSummary from './ReviewSummary';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import 'css/pagination_review.css';
import LoadingIndicator from 'LoadingIndicator';
import ReactPaginate from 'react-paginate';
import './Review.css';

function ReviewList() {
  const { auth } = useAuth();
  const [query, setQuery] = useState('');
  // 페이징
  const [, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [{ data: reviewList, loading, error }, refetch] = useApiAxios(
    {
      url: `/adopt_review/api/reviews/`,
      method: 'GET',
    },
    {
      manual: true,
    },
  );

  const fetchReviews = useCallback(
    async (newPage, newQuery = query) => {
      const params = {
        page: newPage,
        query: newQuery,
      };
      const { data } = await refetch({ params });
      setPage(newPage);
      setPageCount(Math.ceil(data.count / itemsPerPage));
      setCurrentItems(data?.results);
    },
    [query],
  );

  useEffect(() => {
    fetchReviews(1);
  }, []);

  const handlePageClick = (event) => {
    fetchReviews(event.selected + 1);
  };
  const getQuery = (e) => {
    setQuery(e.target.value);
  };
  const handleBTNPress = () => {
    fetchReviews(1, query);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchReviews(1, query);
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
      <div>
        <div className="review_sub_content">
          <div className="pageTop">
            <div className="tit">
              <h2 className="bar_left" style={{ opacity: 1 }}>
                입양후기
              </h2>
              <p className="bar_left" style={{ opacity: 1 }}>
                ADOPT REVIEW
              </p>
            </div>
            {/* 첫번재 영역 */}
            <div className="leftBar2 bar_left"></div>

            {/* 두번째 영역 */}
            <div className="rightBar2 bar_right">
              <img src="/pet-hand3.png" alt="" style={{ opacity: 1 }} />
            </div>
          </div>
        </div>
        <div className="board_top_info2 :before">
          <div className="info_desc">
            <p className="text-right">
              메타버스는 <br />
              사지 않고 가족이 되는 문화를 만듭니다.
            </p>
          </div>
        </div>
      </div>

      <div className="header flex flex-wrap justify-center" id="topLoc">
        <div className="mx-5 notice_header rounded-xl overflow-hidden xs:px-0 sm:px-20 pt-5 pb-10 my-10 w-2/3  lg:w-2/3 md:w-5/6 sm:w-full xs:w-full">
          <div className="review_list"></div>
          <div className="flex xl:justify-end xs:justify-center mt-10">
            {loading && (
              <LoadingIndicator>&nbsp;&nbsp;로딩 중...</LoadingIndicator>
            )}
            {error && (
              <>
                <p className="text-red-400 mt-1">
                  &nbsp;&nbsp; ! 로딩 중 에러가 발생했습니다. ! (조회된 정보가
                  없습니다.)
                </p>
              </>
            )}
          </div>{' '}
          <br />
          <br />
          {/* 검색 필드 + CSS */}
          {/* 검색, 카테고리, 글 작성 버튼 위치 고정하기 (xxs랑 sm 범위에서만) */}
          <div className="mb-6 mt-10">
            <div>
              <div className=" xs:flex-none xl:flex xl:justify-between">
                <div className="flex justify-center xs:mt-5 xl:mt-0">
                  <input
                    type="text"
                    name="query"
                    onChange={getQuery}
                    onKeyPress={handleKeyPress}
                    className="rounded bg-gray-100 focus:outline-none focus:border-gray-400 xs:w-1/2 md:w-72 text-sm px-3 py-2 mr-4 border-2"
                    placeholder="제목, 작성자 ID를 검색하세요."
                  />
                  <button
                    onClick={handleBTNPress}
                    className="rounded bg-purple-500 hover:bg-purple-700 border-purple-500 hover:border-purple-700 md:text-xl  xs:text-md text-white md:w-24 xs:w-16 px-3 border-2"
                    readOnly
                  >
                    검색
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr className="mb-3" />
          {reviewList?.results?.length === 0 && (
            <>
              <div className="flex flex-wrap justify-center rounded mt-10">
                <img src="/not_yet1.png" alt="" />
              </div>
            </>
          )}
          <div className="flex flex-wrap justify-center rounded mb-20 mt-10">
            {reviewList?.results?.map((review) => (
              <div
                key={review.review_no}
                className="transition-transform hover:-translate-y-5 duration-300 my-5 rounded-xl mx-5 mb-3 w-44 h-60 overflow-hidden shadow-lg inline"
              >
                <ReviewSummary review={review} />
              </div>
            ))}
          </div>
          <ReactPaginate
            previousLabel="<"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={itemsPerPage}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            className="pagination_review"
          />
          {auth.isLoggedIn && !auth.is_staff && (
            <div className="flex justify-between">
              <div></div>
              <div>
                <button
                  onClick={() => navigate('/review/new/')}
                  className="hover:scale-110 w-40"
                  readOnly
                >
                  <img src="/not_yet2.png" alt="button"></img>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <div className="review_list2"></div> */}
    </>
  );
}
export default ReviewList;
