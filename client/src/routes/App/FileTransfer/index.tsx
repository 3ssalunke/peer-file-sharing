import { PureComponent, ReactNode, createRef, forwardRef, memo } from 'react';
import { ArrowLeft, Home, Share2, Zap } from 'react-feather';
import { LocalStorageData } from '..';
import QRCode from '../../../icons/QRCode';
import './index.scss';
import { toast } from '../../../components/Toast';

const CanvasWrapped: React.ForwardRefRenderFunction<
  HTMLCanvasElement,
  Record<string, unknown>
> = (props, ref) => {
  return <canvas ref={ref} {...props} />;
};

const Canvas = memo(forwardRef(CanvasWrapped));

interface FileTransferProps {
  room?: string;
}

interface FileTransferState {
  percentage: number | null;
  peers: [];
  isP2P: boolean;
  files: [];
  fileQueued: number;
  errorModal: {
    isOpen: boolean;
    message: string;
  };
  isSelectorEnabled: boolean;
  showQRCodeModal: boolean;
}

class FileTransfer extends PureComponent<FileTransferProps, FileTransferState> {
  client: {
    [key: string]: unknown;
    room: string;
    isLocal: boolean;
  };
  canvas: React.RefObject<HTMLCanvasElement>;
  fileInput: React.RefObject<HTMLInputElement>;

  constructor(props: FileTransferProps) {
    super(props);
    let { room } = props;
    room =
      room &&
      room
        .replace(/[^a-zA-Z0-9 ]/g, ' ')
        .trim()
        .toLowerCase();
    const savedData = JSON.parse(
      localStorage.getItem('ofs')!
    ) as LocalStorageData;
    this.state = {
      percentage: null,
      peers: [],
      isP2P: true,
      files: [],
      fileQueued: 0,
      errorModal: {
        isOpen: false,
        message: '',
      },
      isSelectorEnabled: false,
      showQRCodeModal: false,
    };
    this.client = {
      ...savedData.user,
      room: room || 'Local Network',
      isLocal: !room,
    };
    this.canvas = createRef<HTMLCanvasElement>();
    this.fileInput = createRef<HTMLInputElement>();
  }

  componentDidMount() {
    document.title = `${this.client.room} room | Blaze`;
  }

  handleShare = () => {
    navigator.share({
      title: 'Share files',
      text: `Join my room ${this.client.room} on OFS to share files`,
      url: window.location.href,
    });
  };

  selectFiles = (inputFiles: FileList | null) => {
    if (!inputFiles || !inputFiles.length) {
      toast('Invalid file selected');
      return;
    }

    if (inputFiles[0].size === 0) {
      toast('Multiple files not supported on this browser');
      return;
    }

    if (!this.state.isSelectorEnabled) {
      toast('File transfer is not possible right now');
      return;
    }

    const fileQueued = inputFiles?.length;
    this.setState({
      fileQueued,
    });
  };

  render(): ReactNode {
    const { isP2P, percentage, peers } = this.state;

    return (
      <div className="app-container file-transfer">
        <header className="app-header">
          <button
            className="btn thin icon left"
            aria-label="Go back"
            onClick={() => window.history.back()}
          >
            <ArrowLeft />
          </button>

          <div className="room-name">
            <h1>
              {this.props.room === '' && <Home width="20px" height="20px" />}
              {this.client.room}
            </h1>
          </div>

          <button
            className="btn thin icon right"
            aria-label="Share roomm link"
            onClick={this.handleShare}
          >
            <Share2 />
          </button>
        </header>

        <main>
          <div>
            <Canvas ref={this.canvas} style={{ marginLeft: '-0.6rem' }} />

            {percentage != null && (
              <div className="transfer-percentage">
                {Math.floor(percentage)}%
              </div>
            )}

            <div
              className={`transfer-help ${peers.length > 1 && isP2P && 'p2p'}`}
            >
              {peers.length <= 1 ? (
                `Share room link to devices ${
                  this.client.isLocal ? 'in same local network' : ''
                } you want to share files with`
              ) : isP2P ? (
                <>
                  <Zap size={20} /> Established a P2P network
                </>
              ) : (
                'Using an intermediate server for sharing files'
              )}

              {peers.length <= 1 && (
                <div className="share-room-link">
                  <input value={window.location.href} disabled />
                  <button
                    className={`btn outlined share-link`}
                    onClick={this.handleShare}
                  >
                    Share link
                  </button>
                  <button className={`btn outlined qrcode`}>
                    <QRCode />
                  </button>
                </div>
              )}
            </div>

            <input
              ref={this.fileInput}
              type="file"
              hidden
              multiple
              onChange={(e) => this.selectFiles(e.target.files)}
            />
          </div>
        </main>
      </div>
    );
  }
}

export default FileTransfer;
