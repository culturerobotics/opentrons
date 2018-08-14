#!/usr/bin/env bash

if [ ! -z $RUNNNING_ON_PI ] ; then
    mount_usb.py
    setup_gpio.py

    # Keep all IPv6 addresses on an interface down event. If set static
    # global addresses with no expiration time are not flushed.
    #
    # This allows us to bind to Ethernet adapter's address even if the link
    # us down: i.e. the robot is not connected over USB
    #
    # See: https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux-stable.git/tree/Documentation/networking/ip-sysctl.txt?id=refs/tags/v4.9
    echo 1 > /proc/sys/net/ipv6/conf/eth0/keep_addr_on_down

    # Disable duplicate address detection (DAD)
    # Leaving DAD enabled sometimes results in static address being reset
    # to a random value after robot restart with USB plugged in,
    # because host computer remembers it being used and reports collision.
    echo 0 > /proc/sys/net/ipv6/conf/eth0/accept_dad

    # Cleanup any connections. This will leave only wlan0
    nmcli --terse --fields uuid,device connection show | sed -rn 's/(.*):(--)/\1/p' | xargs nmcli connection del || true
    nmcli --terse --fields uuid,device connection show | sed -rn 's/(.*):(eth0)/\1/p' | xargs nmcli connection del || true

    # nmcli makes an async call which might not finish before next network-related
    # operation starts. There is no graceful way to await for D-BUS event in shell
    # hence sleep is added to avoid race condition
    sleep 1
    nmcli con add con-name "static-eth0" ifname eth0 type ethernet ipv4.method link-local
fi

# Clean up opentrons package dir if it's a first start of a new container
touch /data/id
previous_id=$(cat /data/id)
current_id=$CONTAINER_ID
if [ "$previous_id" != "$current_id" ] ; then
    echo 'First start of a new container. Deleting local Opentrons installation'
    rm -rf /data/packages/usr/local/lib/python3.6/site-packages/opentrons*
    rm -rf /data/packages/usr/local/lib/python3.6/site-packages/ot2serverlib*
    rm -rf /data/packages/usr/local/lib/python3.6/site-packages/otupdate*
    echo "$current_id" > /data/id
fi

