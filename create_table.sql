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