import argparse
from uuid import UUID
import pychromecast

parser = argparse.ArgumentParser(description="Play media url on specified cast device")

parser.add_argument('--url', help='media url to cast')
parser.add_argument('--stop', help='stop casting', action='store_true')
parser.add_argument('--volup', help='increase volume', action='store_true')
parser.add_argument('--voldown', help='decrease volume', action='store_true')
parser.add_argument('--addr', help='cast device IP addrress')
parser.add_argument('--port', help='cast device port (default: 8009)', default='8009', type=int)
parser.add_argument('--uuid', help='cast device uuid')
parser.add_argument('--mime', help='Mime type (default: none (cast device will guess) )', default=None)


args = parser.parse_args()

device = pychromecast.DeviceStatus(None, None, None, UUID(args.uuid), None)

cast = pychromecast.Chromecast(args.addr, args.port, device)

cast.wait()


if args.url:
    cast.media_controller.play_media(args.url, None, args.url)
    cast.media_controller.block_until_active()

if cast.media_controller.is_active:
    if args.stop:
        cast.quit_app()

    if args.volup:
        cast.volume_up()
    
    if args.voldown:
        cast.volume_down()

print(cast.status)