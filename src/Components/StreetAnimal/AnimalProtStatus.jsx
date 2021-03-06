import { useApiAxios } from 'api/base';
import { useAuth } from 'contexts/AuthContext';
import useFieldValues from 'hooks/useFieldValues';
import LoadingIndicator from 'LoadingIndicator';

const INIT_VALUES = {
  protect_status: '',
};

function AnimalProtStatus({ animal, animalId, handleDidSave }) {
  const { auth } = useAuth();
  INIT_VALUES.protect_status = animal.protect_status;
  const { fieldValues, handleFieldChange } = useFieldValues(INIT_VALUES);

  const [
    {
      loading: saveLoading,
      error: saveError,
      errorMessages: saveErrorMessages,
    },
    patchRequest,
  ] = useApiAxios(
    {
      url: `/streetanimal/api/animal/${animalId}/`,
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  // 신청 저장
  const handleSubmit = (e) => {
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
    patchRequest({
      data: formData,
    }).then((response) => {
      const savedPost = response.data;
      // console.log('savedPost', savedPost);
      if (handleDidSave) handleDidSave(savedPost);
    });
  };

  //-----------------------------------------
  return (
    <>
      <div>
        {/* 로딩 에러 */}
        {saveLoading && <LoadingIndicator>로딩 중 ...</LoadingIndicator>}
        {saveError && (
          <>
            <p className="text-red-400">
              &nbsp;&nbsp; ! 로딩 중 에러가 발생했습니다. !
            </p>
          </>
        )}
        {saveError?.response?.status === 401 && (
          <div className="text-red-400">
            조회에 실패했습니다. 입력하신 정보를 다시 확인해주세요.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <select
            name="protect_status"
            value={fieldValues.protect_status}
            onChange={handleFieldChange}
            className="border-2 border-gray-400 rounded px-5 py-2"
          >
            <option value="보호중">보호중</option>
            <option value="입양 매칭 중">입양 매칭 중</option>
            <option value="입양 완료">입양 완료</option>
          </select>
          <button className="bg-gray-300 hover:bg-gray-800 hover:text-white rounded-md p-3 ml-3">
            저장
          </button>
        </form>
      </div>
    </>
  );
}

export default AnimalProtStatus;
