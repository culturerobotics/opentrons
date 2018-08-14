# Inspired by:
# https://hynek.me/articles/sharing-your-labor-of-love-pypi-quick-and-dirty/
import codecs
import os
import shutil
from setuptools import setup, find_packages
import json

HERE = os.path.abspath(os.path.dirname(__file__))


def get_version():
    with open(os.path.join(HERE, 'opentrons', 'package.json')) as pkg:
        package_json = json.load(pkg)
        return package_json.get('version')


VERSION = get_version()

DISTNAME = 'opentrons'
LICENSE = 'Apache 2.0'
AUTHOR = "Opentrons"
EMAIL = "engineering@opentrons.com"
URL = "https://github.com/OpenTrons/opentrons"
DOWNLOAD_URL = ''
CLASSIFIERS = [
    'Development Status :: 5 - Production/Stable',
    'Environment :: Console',
    'Operating System :: OS Independent',
    'Intended Audience :: Science/Research',
    'Programming Language :: Python',
    'Programming Language :: Python :: 3',
    'Programming Language :: Python :: 3.6',
    'Topic :: Scientific/Engineering',
]
KEYWORDS = ["robots", "protocols", "synbio", "pcr", "automation", "lab"]
DESCRIPTION = (
    "The Opentrons API is a simple framework designed to make "
    "writing automated biology lab protocols easy.")
PACKAGES = find_packages(where='.', exclude=["tests.*", "tests"])
INSTALL_REQUIRES = [
    'pyserial==3.2.1',
    'aiohttp==2.3.8',
    'numpy==1.12.1',
    'urwid==1.3.1']


def read(*parts):
    """
    Build an absolute path from *parts* and and return the contents of the
    resulting file.  Assume UTF-8 encoding.
    """
    with codecs.open(os.path.join(HERE, *parts), "rb", "utf-8") as f:
        return f.read()


if __name__ == "__main__":
    setup(
        python_requires='>=3.6',
        name=DISTNAME,
        description=DESCRIPTION,
        license=LICENSE,
        url=URL,
        version=VERSION,
        author=AUTHOR,
        author_email=EMAIL,
        maintainer=AUTHOR,
        maintainer_email=EMAIL,
        keywords=KEYWORDS,
        long_description=read("README.rst"),
        packages=PACKAGES,
        zip_safe=False,
        classifiers=CLASSIFIERS,
        install_requires=INSTALL_REQUIRES,
        setup_requires=['pytest-runner'],
        tests_require=['pytest'],
        include_package_data=True
    )

    if os.environ.get('RUNNING_ON_PI'):
        # This portion of install only applies to installation inside of a
        # Docker container running on Resin, where the RUNNING_ON_PI environ
        # variable will be set
        resource_dir = os.path.join(HERE, 'opentrons', 'resources')
        config_dir = os.environ.get('OT_CONFIG_PATH', '/data/config')
        shutil.copytree(resource_dir, config_dir)
