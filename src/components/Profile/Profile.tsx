import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { profileSliceSelectors } from "../../store/slices/profileSlice";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useEffect, useState } from "react";
import { UploadImage } from "../UploadImage/UploadImage";
import { WatermarkType } from "../../types/ImageFileType";
import { InputSwitch } from "primereact/inputswitch";
import { useEditProfileMutation } from "../../store/api/user";
import { Loader } from "../Loader";
import { ProfileDataType, ProfileTypeEnum } from "../../types/ProfileDataType";
import { OfferList } from "../OfferList/OfferList";
import { Avatar } from "primereact/avatar";
import { Dropdown } from "primereact/dropdown";

type ProfileProps = {
  onGetProfileData: () => void;
}
export const Profile = ({ onGetProfileData }: ProfileProps) => {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector(profileSliceSelectors.profileData);
  const [watermark, setWatermark] = useState<WatermarkType>(null)
  const [watermarkTypeChecked, setWatermarkTypeChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editProfileType, setEditProfileType] = useState(ProfileTypeEnum.Individual);
  const [editAvatar, setEditAvatar] = useState(profileData?.avatar || null);

  const [submitEditProfile, { isLoading: isEditProfileDataLoading, isError: editProfileDataError }] = useEditProfileMutation();

  useEffect(() => {
    onGetProfileData();
  }, [])

  useEffect(() => {
    if (isEditMode && profileData) {
      setEditName(profileData.name || "");
      setEditEmail(profileData.email || "");
      setEditPhone(profileData.phoneNumber || "");
      setEditProfileType(profileData.profileType || ProfileTypeEnum.Individual);
      setEditAvatar(profileData.avatar || null);
      setWatermark(profileData.watermark || null);
      setWatermarkTypeChecked(typeof profileData.watermark === 'string');
    }
  }, [isEditMode, profileData]);

  const onSubmitEditProfile = async (params: Partial<ProfileDataType>) => {
    try {
      setIsLoading(true);
      await submitEditProfile(params);

      setTimeout(() => {
        onGetProfileData(); // Refresh profile data after edit
        setIsEditMode(false);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error submitting profile edit:", error);
    }
  };

  if (!profileData) {
    return null;
  }

  const showLoader = isEditProfileDataLoading || isLoading;

  return (
    <div className="profile-wrapper p-4">
      <Loader show={showLoader} />
      {/* Personal Information Section. */}
      {!isEditMode &&
        (<Card title="Лична информация" className="mb-4">
          <div className="grid">
            <div className="col-12 md:col-6 flex flex-column">
              <label className="text-muted text-sm mb-1">Профилна снимка:</label>
              <div className="mb-2">
                <Avatar
                  image={profileData.avatar?.url || undefined}
                  label={profileData.name ? profileData.name.charAt(0) : ""}
                  size="xlarge"
                  shape="circle"
                />
              </div>
            </div>
            <div className="col-12 md:col-6">
              <label className="text-muted text-sm">Име:</label>
              <p className="text-lg">{profileData.name}</p>
            </div>
            <div className="col-12 md:col-6">
              <label className="text-muted text-sm">Имейл:</label>
              <p className="text-lg">{profileData.email}</p>
            </div>
            <div className="col-12 md:col-6">
              <label className="text-muted text-sm">Телефон:</label>
              <p className="text-lg">{profileData.phoneNumber}</p>
            </div>
            <div className="col-12 md:col-6">
              <label className="text-muted text-sm">Вид на профила:</label>
              <p className="text-lg">{profileData.profileType}</p>
            </div>
            <div className="col-12 md:col-6">
              <label className="text-muted text-sm">Воден Знак:</label>
              {typeof profileData.watermark === 'string' && (
                <p className="text-lg">{profileData.watermark}</p>)
              }
              {typeof profileData.watermark === 'object' && profileData.watermark?.url && (
                <p><img src={profileData.watermark.url} alt="Watermark" width={100} height={100} /></p>)
              }
            </div>
          </div>
          {!isEditMode && <Button icon="pi pi-pencil" label="Редактирай профил" className="ml-auto" onClick={() => { setIsEditMode(true) }} />}
        </Card>)
      }

      {/* Personal Information Edit Section.*/}
      {isEditMode &&
        (<Card title="Редактирай профил" className="mb-4">
          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmitEditProfile({
                name: editName,
                email: editEmail,
                phoneNumber: editPhone,
                profileType: editProfileType,
                avatar: editAvatar,
                watermark,
              });
            }}
          >
            <div className="grid">
              <div className="col-12 md:col-6 flex flex-column">
                <label className="text-muted text-sm mb-1">Профилна снимка:</label>
              <UploadImage initialImage={editAvatar} onUpload={file => setEditAvatar(file)} />
              </div>
              <div className="col-12 md:col-6">
                <label className="text-muted text-sm">Име:</label>
                <InputText
                  name="name"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="text-muted text-sm">Имейл:</label>
                <InputText
                  name="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="text-muted text-sm">Телефон:</label>
                <InputText
                  name="phoneNumber"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="text-muted text-sm">Вид на профила:</label>
                <Dropdown
                  name="profileType"
                  value={editProfileType}
                  options={[
                    { label: ProfileTypeEnum.Individual, value: ProfileTypeEnum.Individual },
                    { label: ProfileTypeEnum.Agency, value: ProfileTypeEnum.Agency }
                  ]}
                  onChange={e => setEditProfileType(e.value)}
                  className="w-full"
                  placeholder="Избери тип"
                />
              </div>
              <div className="col-12 md:col-6">
                <label className="text-muted text-sm">Воден Знак:</label>
                <div className="flex align-items-center gap-2 mb-2">
                  <span className="text-muted text-sm">Лого</span>
                  <InputSwitch checked={watermarkTypeChecked} onChange={(e) => setWatermarkTypeChecked(e.value)} />
                  <span className="text-muted text-sm">Текст</span>
                </div>
                {!watermarkTypeChecked && (
                  // @ts-ignore initialImage can be null
                  <UploadImage initialImage={typeof watermark === 'object' ? watermark : null} onUpload={(file) => setWatermark(file)} />
                )}
                {watermarkTypeChecked && (
                  <InputText
                    id="watermark-text"
                    placeholder="Въведете текст"
                    value={typeof watermark === 'string' ? watermark : ''}
                    onChange={(e) => setWatermark(e.target.value)}
                    className="w-full"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-content-end gap-2 mt-3">
              <Button
                type="button"
                label="Отказ"
                className="p-button-secondary"
                onClick={() => setIsEditMode(false)}
              />
              <Button
                type="submit"
                icon="pi pi-save"
                label="Запази"
                className="ml-auto"
              />
            </div>
          </form>
        </Card>)
      }
      {/* Security Section */}
      <Card title="Смяна на парола" className="mb-4">
        <div className="flex align-items-center gap-3">
          <Password placeholder="Текуща парола" toggleMask />
          <Password placeholder="Нова парола" toggleMask />
          <Password placeholder="Потвърдете паролата" toggleMask />
        </div>

        <Button label="Запази" className="mt-2" />
      </Card>

      {/* Favorites Section */}
      <Card title="Любими имоти" className="mb-4">
        <OfferList offers={[]} />
      </Card>

      {/* Settings Section */}
      <Card title="Настройки">
        <div className="flex flex-row gap-3">
          <label className="text-muted text-sm">Език</label>
          <InputText placeholder="Български" />
          <div className="flex align-items-center gap-2">
            {/* <Checkbox checked={notifications} onChange={(e) => setNotifications(e.checked)} /> */}
            <label>Получаване на имейл известия</label>
          </div>
        </div>
        <Button label="Запази промените" className="mt-2" />
      </Card>
    </div>
  );
};