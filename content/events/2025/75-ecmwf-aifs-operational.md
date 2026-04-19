---
id: ecmwf-aifs-operational
title: "ECMWF AIFS Becomes First Operational AI Weather Forecast System"
date: 2025-02-25
category: research
significance: major
confidence: high
regions: [EU]
actors:
  - id: ecmwf
    role: subject
tags: [weather-forecasting, AIFS, operational-AI, climate, ensemble-forecasting]
threads: [ai-for-science]
sources:
  - url: https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ai-forecasts-become-operational
    title: "ECMWF's AI forecasts become operational"
    type: official
    publisher: ECMWF
    date: 2025-02-25
  - url: https://www.ecmwf.int/en/about/media-centre/news/2025/ecmwfs-ensemble-ai-forecasts-become-operational
    title: "ECMWF's Ensemble AI Forecasts Become Operational"
    type: official
    publisher: ECMWF
    date: 2025-07-01
  - url: https://arxiv.org/abs/2509.18994
    title: "AIFS-CRPS: ensemble forecasting using a score-based diffusion model"
    type: primary_document
    publisher: arXiv
    date: 2025-09-01
---

## Summary

The European Centre for Medium-Range Weather Forecasts made its AI Integrated Forecasting System (AIFS) fully operational in February 2025 — the first time a machine-learning weather model had been deployed in real-time 24/7 operations at a major national meteorological organization. An ensemble version, AIFS ENS with 51 members, followed on July 1, completing the transition of ECMWF's medium-range prediction suite to AI.

## What Happened

ECMWF's Integrated Forecasting System had been the global benchmark for medium-range numerical weather prediction for decades. The transition to AIFS represented a fundamental change in the physics of forecasting: where the legacy IFS solved discretized fluid dynamics equations on a global grid, AIFS learned weather dynamics directly from 40 years of reanalysis data using a graph neural network architecture.

The operational deployment in February 2025 began with the deterministic single-trajectory forecast, running alongside the legacy IFS rather than replacing it. Verification against radiosonde observations and surface station networks showed AIFS competitive with or superior to IFS on several surface variables including 2m temperature, where early evaluations indicated up to 20% lower root-mean-square error in the medium range. The model ran on a fraction of the computational budget of its physics-based predecessor — estimates put it at roughly 1,000 times more energy-efficient per forecast cycle.

The July 1 operational launch of AIFS ENS extended the approach to ensemble prediction. Generating 51 parallel ensemble members, each representing a plausible state of the atmosphere, had previously required enormous compute resources that limited ensemble resolution. AIFS ENS produced full-resolution ensemble forecasts at a cost that permitted more frequent updates.

## Why It Matters

ECMWF's operational commitment carried weight that research benchmarks do not. Academic papers showing that ML models outperform IFS on held-out test sets had accumulated since GraphCast (2023) and Pangu-Weather; the operational deployment forced ECMWF to stake its institutional credibility on AIFS performing reliably in production, 24 hours a day, across all weather regimes including the high-impact extreme events that matter most.

The implications extended beyond meteorology. ECMWF's adoption signaled to other physical sciences that the transition from first-principles simulation to data-driven ML forecasting was not merely academically plausible but operationally viable. The energy efficiency story was particularly significant for climate projection: if similar efficiency gains could be achieved in climate modeling, the compute cost of running large ensembles of century-scale projections — currently prohibitive — might become tractable.
