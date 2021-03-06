import { useApiAxios } from 'api/base';
import { useEffect } from 'react';
import useFieldValues from 'hooks/useFieldValues';
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const INIT_FIELD_VALUES = {
  comment_content: '',
};

function LostPetBoardCommentForm({
  refetch,
  commentID,
  lostpetboardId,
  hidden,
  setHidden,
}) {
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [{ data: getdata, loading, error }, commentRefetch] = useApiAxios(
    `/lost_pet_board/api/comments/${commentID}/`,
    { manual: !commentID },
  );

  // 저장
  const [
    {
      data: lostBoard,
      loading: saveLoading,
      error: saveError,
      errorMessages: saveErrorMessages,
    },
    saveRequest,
  ] = useApiAxios(
    {
      url: !commentID
        ? `/lost_pet_board/api/comments/`
        : `/lost_pet_board/api/comments/${commentID}/`,
      method: !commentID ? 'POST' : 'PATCH',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  INIT_FIELD_VALUES.user = getdata ? getdata.user.userID : auth.userID;
  INIT_FIELD_VALUES.lost_board_no = getdata
    ? getdata.lost_board_no.lost_board_no
    : lostpetboardId;
  INIT_FIELD_VALUES.comment_content = getdata ? getdata.comment_content : '';

  const { fieldValues, handleFieldChange, clearFieldValues } =
    useFieldValues(INIT_FIELD_VALUES);

  // console.log('fieldValues', fieldValues);
  // console.log('commentID', commentID);

  const handleEdit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(fieldValues).forEach(([name, value]) => {
      if (Array.isArray(value)) {
        const fileList = value;
        fileList.forEach((file) => formData.append(name, file));
      } else {
        formData.append(name, value);
      }
    });
    if (window.confirm('댓글을 정말 수정 할까요?')) {
      saveRequest({
        data: formData,
      }).then(() => {
        commentRefetch()
          .then(() => refetch())
          .then(() => setHidden(!hidden));
      });
    }
  };

  //   function clearTextArea() {
  //     document.getElementById('comments').value = '';
  //   }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fieldValues.comment_content === '') {
      window.alert('댓글 내용을 입력해주세요.');
    } else
      saveRequest({
        data: fieldValues,
      }).then(() => {
        clearFieldValues();
        refetch();
      });
  };

  const didYouLog = () => {
    if (window.confirm('로그인 하시겠습니까?')) {
      navigate('/accounts/login/');
    }
  };

  return (
    <>
      <div>
        <h1>
          <div className="shadow-md">
            <form className="w-full p-5">
              <div className="mb-2 mt-0">
                <label form="comment" className="text-lg text-gray-600">
                  댓글
                </label>

                {auth.isLoggedIn ? (
                  <textarea
                    id="comments"
                    className="w-full h-20 p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1 mt-3"
                    name="comment_content"
                    placeholder="댓글을 입력해주세요."
                    value={fieldValues?.comment_content}
                    onChange={handleFieldChange}
                  ></textarea>
                ) : (
                  <textarea
                    className="w-full h-20 p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1 mt-3"
                    name="content"
                    placeholder="댓글을 입력하려면 로그인해주세요."
                    onClick={didYouLog}
                  ></textarea>
                )}
              </div>
              <div className="text-right">
                {!commentID ? (
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm text-blue-100 bg-blue-500 rounded"
                    onClick={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    등록
                  </button>
                ) : (
                  hidden
                )}
                {commentID ? (
                  <div className="flex justify-end gap-2 ">
                    <button
                      type="submit"
                      className="px-3 py-2 text-sm text-blue-100 bg-blue-500 rounded"
                      onClick={(e) => handleEdit(e)}
                    >
                      수정
                    </button>

                    <button
                      type="button"
                      name="clear"
                      className="px-3 py-2 text-sm text-blue-100 bg-blue-500 rounded"
                      onClick={() => {
                        setHidden(!hidden);
                      }}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  hidden
                )}{' '}
              </div>
            </form>
          </div>
        </h1>
      </div>
    </>
  );
}
export default LostPetBoardCommentForm;
