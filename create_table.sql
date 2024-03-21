create sequence serial start with 1;
create table public.get_location (
  id serial not null
  , userid character varying(255) not null
  , location geography(Point,4326)
  , timestamp timestamp(6) without time zone
);
create table public.id_token (
  userid character varying(255) not null
  , token character varying(255) not null
  , timestamp timestamp(6) without time zone default CURRENT_TIMESTAMP not null
  , primary key (userid)
);
create table campaign
(c_id int,
name character varying(255),
message character varying(255),
c_location geography(Point,4326),
within int,
eventdate date
);
create table customer
(cus_id int,
partyid character varying(255),
name character varying(255),
email character varying(255),
tel character varying(255));
insert into campaign values(1,'春のパン祭り🌸','暖かくなりましたね。そんなあなたにハッピーなプレゼント',st_setSRID(ST_Point(139.729199, 35.623336),4326),500,current_date);
select g.location,c.message from get_location g join campaign c on ST_DWithin(g.location,c.c_location,c.within) where c.c_id=1;
insert into customer values(1,'犬🐶のオープン','拓也','tkishimo@fushigi-lab.com','05058324475');
