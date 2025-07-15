import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { profileSliceActions, profileSliceSelectors } from "../../store/slices/profileSlice";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";
import { UploadImage } from "../UploadImage/UploadImage";
import { WatermarkType } from "../../types/ImageFileType";
import { InputSwitch } from "primereact/inputswitch";
import { useEditProfileMutation, useGetProfileDataMutation } from "../../store/api/user";
import { Loader } from "../Loader";
import { ProfileDataType } from "../../types/ProfileDataType";

type ProfileProps = {
  onGetProfileData: () => void;
}
export const Profile = ({ onGetProfileData }: ProfileProps) => {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector(profileSliceSelectors.profileData);
  const [watermark, setWatermark] = useState<WatermarkType>(null)
  const [watermarkTypeChecked, setWatermarkTypeChecked] = useState(false);

  const [submitEditProfile, { isLoading: isEditProfileDataLoading, isError: editProfileDataError }] = useEditProfileMutation();

  const onSubmitEditProfile = async (params: Partial<ProfileDataType>) => {
    try {
      await submitEditProfile(params);

      setTimeout(() => {
        onGetProfileData(); // Refresh profile data after edit
      }, 1000);
    } catch (error) {
      console.error("Error submitting profile edit:", error);
    }
  };
  useEffect(() => {
    onGetProfileData();
  }, [])
  if (!profileData) {
    return null;
  }

  const isLoading = isEditProfileDataLoading;

  return (
    <div className="profile-wrapper p-4">
      <Loader show={isLoading} />
      {/* Hero Section */}
      <div className="hero-section flex align-items-center gap-4 mb-4">
        <div className="avatar bg-primary text-white flex align-items-center justify-content-center border-circle" style={{ width: "80px", height: "80px", fontSize: "24px" }}>
          {profileData.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="m-0">{profileData.name}</h2>
          <p className="text-muted">{profileData.profileType === "individual" ? "Частно лице" : "Агенция"}</p>
        </div>
        <Button icon="pi pi-pencil" label="Редактирай профил" className="ml-auto" />
      </div>

      {/* Personal Information Section. TODO: Editable */}
      <Card title="Лична информация" className="mb-4">
        <div className="grid">
          <div className="col-12 md:col-6">
            <label className="text-muted text-sm">Име</label>
            <p className="text-lg">{profileData.name}</p>
          </div>
          <div className="col-12 md:col-6">
            <label className="text-muted text-sm">Имейл</label>
            <p className="text-lg">{profileData.email}</p>
          </div>
          <div className="col-12 md:col-6">
            <label className="text-muted text-sm">Телефон</label>
            <p className="text-lg">{profileData.phoneNumber}</p>
          </div>
          <div className="col-12 md:col-6">
            <label className="text-muted text-sm">Вид на профила</label>
            <p className="text-lg">{profileData.profileType === "individual" ? "Частно лице" : "Агенция"}</p>
          </div>
          <div className="col-12 md:col-6">
            <label className="text-muted text-sm">Воден Знак</label>
            {typeof profileData.watermark === 'string' && (
              <p className="text-lg">{profileData.watermark}</p>)
            }
            {typeof profileData.watermark === 'object' && profileData.watermark?.url && (
              <img src={profileData.watermark.url} alt="Watermark" className="w-20rem h-20rem" />)
            }
          </div>
        </div>
      </Card>

      {/* Personal Information Section. TODO: view mode only */}
      <Card title="Воден знак" className="mb-4">
        <div className="flex justify-content-between align-items-center mb-3">
          <div className="flex flex-column gap-1">
            <div className="flex justify-content-center align-items-center gap-2">
              <div className="text-muted text-sm">Лого</div>
              <InputSwitch checked={watermarkTypeChecked} onChange={(e) => setWatermarkTypeChecked(e.value)} />
              <div className="text-muted text-sm">Текст</div>
            </div>
            {!watermarkTypeChecked && <UploadImage onUpload={(file) => {
              setWatermark(file)
            }} />}
            {watermarkTypeChecked && <InputText id="watermark-text" placeholder="Search" onChange={(e) => {
              setWatermark(e.target.value);
            }} />}
          </div>
        </div>
        <Button onClick={() => {
          onSubmitEditProfile({
            watermark,
            email: profileData.email,
          });
        }} icon="pi pi-save" label="Запази" className="ml-auto" />
      </Card>

      {/* Security Section */}
      <Card title="Сигурност" className="mb-4">
        <div className="flex flex-column gap-3">
          <label className="text-muted text-sm">Смяна на парола</label>
          <Password placeholder="Нова парола" toggleMask />
          <Button label="Запази" className="mt-2" />
        </div>
      </Card>

      {/* My Properties Section */}
      <Card title="Моите обяви" className="mb-4">
        <div className="flex justify-content-between align-items-center mb-3">
          <h3>Вашите обяви</h3>
          <Button label="Добави нова обява" icon="pi pi-plus" />
        </div>
        <div className="grid">
          {/* Example property cards */}
          <div className="col-12 md:col-4">
            <Card title="Апартамент в София" subTitle="€100,000">
              <p>Площ: 80 кв.м</p>
              <Button label="Редактирай" icon="pi pi-pencil" className="p-button-text" />
            </Card>
          </div>
        </div>
      </Card>

      {/* Favorites Section */}
      <Card title="Любими имоти" className="mb-4">
        <div className="grid">
          {/* Example favorite properties */}
          <div className="col-12 md:col-4">
            <Card title="Къща в Пловдив" subTitle="€200,000">
              <p>Площ: 120 кв.м</p>
              <Button label="Премахни от любими" icon="pi pi-heart-fill" className="p-button-text" />
            </Card>
          </div>
        </div>
      </Card>

      {/* Settings Section */}
      <Card title="Настройки">
        <div className="flex flex-column gap-3">
          <label className="text-muted text-sm">Език</label>
          <InputText placeholder="Български" />
          <div className="flex align-items-center gap-2">
            {/* <Checkbox checked={notifications} onChange={(e) => setNotifications(e.checked)} /> */}
            <label>Получаване на имейл известия</label>
          </div>
          <Button label="Запази промените" className="mt-2" />
        </div>
      </Card>
    </div>
  );
};