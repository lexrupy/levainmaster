#!/usr/bin/env python3
# Levain Master — © 2026 Alexandre da Silva
# SPDX-License-Identifier: LGPL-3.0-or-later
"""Sobe o app em http://0.0.0.0:8765, servindo a pasta deste arquivo.

    python3 start.py
"""
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
os.execv(sys.executable, [sys.executable, "-m", "http.server", "--bind", "0.0.0.0", "8765"])
