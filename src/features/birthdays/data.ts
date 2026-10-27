import type { StaticImageData } from "next/image";
import { elder1, elder4 } from "@/lib/images";

export interface TodaysBirthday {
  nickname: string;
  name: string;
  subfamily: string;
  date: string;
  wishes: number;
  avatar: StaticImageData;
  avatarAlt: string;
}

export interface UpcomingBirthday {
  month: string;
  day: string;
  name: string;
  subfamily: string;
  parent: string;
  avatar: StaticImageData;
  avatarAlt: string;
}

/**
 * Sample celebration records until birthdays arrive from the API.
 * The dates are sample data the same way the family tree's stand-ins are:
 * distinct enough to exercise the card and the list, marked as samples on
 * the page so nobody plans a party around them.
 */
/* The design celebrates the signed-in member herself: "Dream Baby" is the
   affectionate nickname above her name, the way the tree records people. */
export const TODAY: TodaysBirthday = {
  nickname: "Dream Baby",
  name: "Aganze",
  subfamily: "Wihogora",
  date: "March 28",
  wishes: 42,
  avatar: elder4,
  avatarAlt: "Portrait of Aganze in a mint shirt",
};

export const UPCOMING: UpcomingBirthday[] = [
  {
    month: "MAR",
    day: "29",
    name: "Bigwi",
    subfamily: "Light",
    parent: "Sheja Ngabo",
    avatar: elder1,
    avatarAlt: "Portrait of Bigwi beside memorial pillars",
  },
];
