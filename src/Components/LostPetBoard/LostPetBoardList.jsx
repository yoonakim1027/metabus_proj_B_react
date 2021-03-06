import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import useFieldValues from 'hooks/useFieldValues';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import 'css/pagination_lostPetBoard.css';
import LoadingIndicator from 'LoadingIndicator';
import LostPetBoardSummary from './LostPetBoardSummary';

const INIT_FIELD_VALUES = { category: '전체' };

function LostPetBoardList() {
  const { auth } = useAuth();
  const [query, setQuery] = useState('');
  // 페이징
  const [, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  const [{ data: lostPetBoardList, loading, error }, refetch] = useApiAxios(
    {
      url: `/lost_pet_board/api/board/`,
      method: 'GET',
    },
    {
      manual: true,
    },
  );

  const { fieldValues, handleFieldChange } = useFieldValues(INIT_FIELD_VALUES);

  // 검색을 위한 초기값 설정
  const [searchLocation, setSearchLocation] = useState('');
  const [searchAnimal, setSearchAnimal] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const fetchLostPetBoard = useCallback(
    async (newPage, newQuery = query) => {
      const params = {
        page: newPage,
        query: newQuery,
        location: searchLocation,
        animaltype: searchAnimal,
        status: searchStatus,
      };
      const { data } = await refetch({ params });
      setPage(newPage);
      setPageCount(Math.ceil(data.count / itemsPerPage));
      setCurrentItems(data?.results);
    },
    [query, searchLocation, searchAnimal, searchStatus],
  );

  useEffect(() => {
    fetchLostPetBoard(1);
  }, []);

  const handlePageClick = (event) => {
    fetchLostPetBoard(event.selected + 1);
  };

  const getQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleBTNPress = () => {
    fetchLostPetBoard(1, query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchLostPetBoard(1, query);
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
        <div className="lostpet_sub_content">
          <div className="lostpet_pageTop">
            <div className="tit">
              <h2 className="lostpet_bar_left" style={{ opacity: 1 }}>
                잃어버렸어요 😹
              </h2>
              <p className="lostpet_bar_left" style={{ opacity: 1 }}>
                Lost My Pet
              </p>
            </div>
            {/* 첫번재 영역 */}
            <div className="leftBar lostpet_bar_left"></div>

            {/* 두번째 영역 */}
            <div className="rightBar lostpet_bar_right">
              <img src="/dog_red.png" alt="" style={{ opacity: 1 }} />
            </div>
          </div>
        </div>
        <div className="lostpet_board_top_info :before">
          <div className="info_desc">
            <p className="text-right">
              메타버스는 <br />
              사지 않고 가족이 되는 문화를 만듭니다.
            </p>
          </div>
        </div>
      </div>

      <div className="header flex flex-wrap justify-center">
        <div className="lost_header mx-5 rounded-xl overflow-hidden xs:px-0 sm:px-20 pt-5 pb-10 my-10 w-2/3  lg:w-2/3 md:w-5/6 sm:w-full xs:w-full">
          <div className="lost_list"></div>
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
          </div>

          {/* 검색 필드 */}
          <div className="mb-6 mt-10">
            <div>
              <div className=" xs:flex-none xl:flex xl:justify-between">
                {/* 유실 장소 선택 */}
                <div>
                  <form className="flex justify-center">
                    <select
                      name="lost_location"
                      value={fieldValues.lost_location}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="md:text-xl xs:text-base border-2 border-red-400 rounded p-2 xs:w-32 md:w-60 text-center py-2"
                      defaultValue="유실 장소"
                    >
                      <option value="">유실 장소</option>
                      <option value="서울">서울</option>
                      <option value="부산">부산</option>
                      <option value="대구">대구</option>
                      <option value="인천">인천</option>
                      <option value="광주">광주</option>
                      <option value="대전">대전</option>
                      <option value="울산">울산</option>
                      <option value="세종">세종</option>
                      <option value="경기">경기</option>
                      <option value="강원">강원</option>
                      <option value="충북">충북</option>
                      <option value="충남">충남</option>
                      <option value="전북">전북</option>
                      <option value="전남">전남</option>
                      <option value="경북">경북</option>
                      <option value="경남">경남</option>
                      <option value="제주">제주</option>
                    </select>
                  </form>
                </div>

                {/* 동물 종류 선택 */}
                <div>
                  <form className="flex justify-center">
                    <select
                      name="animal_type"
                      value={fieldValues.animal_type}
                      onChange={(e) => setSearchAnimal(e.target.value)}
                      className="md:text-xl xs:text-base border-2 border-red-400 rounded p-2 xs:w-32 md:w-60 text-center py-2"
                      defaultValue="동물 종류"
                    >
                      <option value="">동물 종류</option>
                      <option value="개">개</option>
                      <option value="고양이">고양이</option>
                    </select>
                  </form>
                </div>

                {/* 상태 선택 */}
                <div>
                  <form className="flex justify-center">
                    <select
                      name="status"
                      value={fieldValues.status}
                      onChange={(e) => setSearchStatus(e.target.value)}
                      className="md:text-xl xs:text-base border-2 border-red-400 rounded p-2 xs:w-32 md:w-60 text-center py-2"
                      defaultValue="상태 선택"
                    >
                      <option value="">상태 선택</option>
                      <option value="찾는중">찾는중</option>
                      <option value="찾았어요">찾았어요</option>
                    </select>
                  </form>
                </div>

                <div className="flex justify-center xs:mt-5 xl:mt-0">
                  <button
                    onClick={handleBTNPress}
                    className="rounded bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 md:text-xl  xs:text-md text-white md:w-24 xs:w-16 px-3 border-2"
                    readOnly
                  >
                    검색
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr className="mb-3" />

          <div className="flex flex-wrap justify-center rounded mb-20 mt-10">
            {lostPetBoardList?.results?.map((lostpetboard) => (
              <div
                key={lostpetboard.lost_board_no}
                className="transition-transform hover:-translate-y-5 duration-300 my-5 rounded-xl mx-5 mb-3 w-44 h-60 overflow-hidden shadow-lg inline"
              >
                <LostPetBoardSummary lostpetboard={lostpetboard} />
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
            className="pagination_lostPetBoard"
          />
          {auth.isLoggedIn && !auth.is_staff && (
            <div className="flex justify-between">
              <div></div>
              <div>
                <button
                  onClick={() => navigate('/lostpetboard/new/')}
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
    </>
  );
}

export default LostPetBoardList;
