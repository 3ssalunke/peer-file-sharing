import logo from '../../../assets/images/logo.svg';
import network from '../../../assets/images/illustrations/network.svg';
import NickNameInput from '../../../components/NickNameInput';
import { createLocalStorageDispatch } from 'react-localstorage-hooks';
import { LocalStorageData } from '..';

const registerUser = createLocalStorageDispatch<LocalStorageData>(
  'ofs',
  (_, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    return {
      user: {
        name: formData.get('nickname') as string,
      },
      rooms: [],
    };
  }
);

function NewUser() {
  return (
    <main>
      <img src={logo} alt="ofs" />

      <img src={network} alt="Devices connected using ofs" />

      <div>
        <h1>Choose a nickname</h1>
        <p>
          Nicknames are used to identify different devices in a common file
          sharing room. A room must always have devices with unique nicknames.
        </p>
      </div>

      <form onSubmit={registerUser}>
        <NickNameInput input={{ style: { marginBottom: '40' } }} />
        <button type="submit">Continue</button>
      </form>
    </main>
  );
}

export default NewUser;
