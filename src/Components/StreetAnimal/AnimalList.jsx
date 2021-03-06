import { useApiAxios } from 'api/base';
import { useCallback, useEffect } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import 'css/pagination_animal.css';
import '../../App.css';
import './Animal.css';
import LoadingIndicator from 'LoadingIndicator';

function AnimalList() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // 페이징
  const [, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [{ data: AnimalList, loading, error }, refetch] = useApiAxios(
    {
      url: `/streetanimal/api/animal/`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  const fetchAnimal = useCallback(
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
    fetchAnimal(1);
  }, []);

  const handlePageClick = (event) => {
    fetchAnimal(event.selected + 1);
  };

  const getQuery = (e) => {
    setQuery(e.target.value);
  };

  const handleBTNPress = () => {
    fetchAnimal(1, query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchAnimal(1, query);
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
        <div className="notice_header rounded-xl px-20 pt-5 pb-10 my-10 w-2/3">
          <blockquote className="mt-5 text-6xl mb-3 font-semibold italic text-center text-slate-900">
            <span className="mt-7 mb-3 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-red-400 relative inline-block">
              <span className="relative text-white">" 유기동물 관리 "</span>
            </span>
          </blockquote>

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

          <div className="mb-6 mt-10">
            <div className="xs:flex-none xl:flex xl:justify-between">
              <div></div>
              <div className="xs:mt-5 xl:mt-0">
                <div className="flex justify-center">
                  <input
                    type="text"
                    name="query"
                    onChange={getQuery}
                    onKeyPress={handleKeyPress}
                    className="rounded bg-gray-100 focus:outline-none focus:border-gray-400 w-72 text-base px-3 py-2 mr-4 border-2"
                    placeholder="번호 또는 등록번호를 검색하세요."
                  />
                  <button
                    onClick={handleBTNPress}
                    className="rounded bg-red-500 hover:bg-red-700 border-red-500 hover:border-red-700 text-xl text-white w-24 px-3 py-2 border-2"
                    readOnly
                  >
                    검색
                  </button>
                </div>
                <div className="flex justify-center">
                  {loading && <LoadingIndicator>검색 중 ...</LoadingIndicator>}
                  {error && <h2 className="">검색된 정보가 없습니다.</h2>}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <table className="border text-center min-w-full divide-y divide-gray-200 whitespace-nowrap">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider"
                  >
                    공고번호
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider"
                  >
                    축종
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider"
                  >
                    품종
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xl font-bold text-gray-500 uppercase tracking-wider"
                  >
                    보호 센터명
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {AnimalList &&
                  AnimalList.results.map((animal, index) => (
                    <tr
                      key={index}
                      onClick={() =>
                        navigate(`/admin/animal/${animal.announce_no}/`)
                      }
                      className="cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="text-base font-medium text-gray-900">
                          {animal.announce_no}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xl text-gray-900 font-semibold rounded-full bg-red-100">
                          {animal.kind_of_animal}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {animal.breed}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {animal.center_name.center_name}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <ReactPaginate
            previousLabel="<"
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={itemsPerPage}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
            className="pagination_animal"
          />
        </div>
      </div>
    </>
  );
}

export default AnimalList;
