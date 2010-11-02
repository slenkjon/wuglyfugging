#!/usr/bin/env perl

$frag=shift;
while( <> )
{
    $trd = $_;
    if( m/g6$frag\.$frag/ )
    {
	$trd =~ s/g6$frag\.$frag(.)/g6$frag.\l$1/g;
    }
    elsif( m/$frag\S+:/ )
    {
	$trd =~ s/$frag(\S)/\l$1/;
    }
    print $trd;
}

