const cross = require('../../assets/icons/cross.png');

const menu = require('../../assets/icons/menu.png');

const filter = require('../../assets/icons/filter.png');
const down_arrow = require('../../assets/icons/down_arrow.png');
const favourite = require('../../assets/icons/favourite.png');
const rice = require('../../assets/icons/rice.png');
const love = require('../../assets/icons/love.png');
const home = require('../../assets/icons/home.png');
const location = require('../../assets/icons/location.png');
const logout = require('../../assets/icons/logout.png');
const notification = require('../../assets/icons/notification.png');
const setting = require('../../assets/icons/setting.png');
const star = require('../../assets/icons/star.png');
const wallet = require('../../assets/icons/wallet.png');
const help = require('../../assets/icons/help.png');
const logo = require('../../assets/icons/small-logo.png');
const back = require('../../assets/images/back.png');
const menu1 = require('../../assets/icons/menu.svg');
const dotsTop = require('../../assets/icons/dotsTop.png');
const dotsBottom = require('../../assets/icons/dotsBottom.png');
const menubar = require('../../assets/icons/menubar.png');
const right_arrow = require('../../assets/icons/right-arrow.png');
const disc = require('../../assets/images/disc.png');
const dashboard = require('../../assets/icons/dashboard.png');
const notifications_outline = require('../../assets/icons/notifications-outline.png');
const access = require('../../assets/icons/access.png');
import Icon2 from 'react-native-vector-icons/Ionicons';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from './theme';

const packs = <Icon2 name="infinite-sharp" size={18} color={COLORS.primary} />;
const order = <Icons name="shopping-bag" size={18} color={COLORS.primary} />;

const subs = (
  <Icon name="truck-delivery-outline" size={20} color={COLORS.primary} />
);

const download = (
  <Icon2 name="ios-document-attach-outline" size={18} color={COLORS.primary} />
);

const shop = (
  <Icon2
    name="ios-information-circle-outline"
    size={18}
    color={COLORS.primary}
  />
);

const language = <Icon1 name="language" size={18} color={COLORS.primary} />;

export default {
  cross,
  menu,
  filter,
  down_arrow,
  favourite,
  rice,
  love,
  home,
  location,
  logout,
  dotsTop,
  dotsBottom,
  notification,
  setting,
  star,
  wallet,
  help,
  logo,
  back,
  menu1,
  menubar,
  right_arrow,
  disc,
  dashboard,
  notifications_outline,
  access,
  packs,
  order,
  subs,
  download,
  shop,
  language,
};
