---
id: google-weathernext-cyclone-forecasting
title: "Google DeepMind Reports One-Day Gain in Cyclone Forecast Accuracy"
date: 2026-08-06
category: research
significance: notable
confidence: high
sources:
  - url: https://deepmind.google/blog/weathernext-ai-model-achieves-breakthrough-in-forecasting-cyclones/
    title: "WeatherNext: AI model achieves breakthrough in forecasting cyclones"
    type: official
    publisher: Google DeepMind
    date: 2026-08-06
    accessed: 2026-08-11
    archive_url: https://web.archive.org/web/*/https://deepmind.google/blog/weathernext-ai-model-achieves-breakthrough-in-forecasting-cyclones/
  - url: https://www.wired.com/story/deepmind-ai-model-can-predict-hurricanes-earlier/
    title: "DeepMind Says Its AI Can Predict Hurricanes Earlier Than Everyone Else"
    type: secondary_reporting
    publisher: WIRED
    date: 2026-08-06
    accessed: 2026-08-11
actors:
  - id: google-deepmind
    role: subject
regions: [US]
tags: [weather-forecasting, tropical-cyclones, disaster-preparedness, ai-for-science, ensemble-forecasting, open-source]
threads: [ai-for-science]
related: [ecmwf-aifs-operational]
state: published
revision:
  created: 2026-08-11
  last_reviewed: 2026-08-11
  draft_assistance: ai-assisted
  final_author: pedro-bright
---

## Summary

On August 6, 2026, Google DeepMind reported that its WeatherNext Cyclones model predicted tropical-cyclone tracks, intensity, and wind structure with approximately one additional day of useful accuracy compared with prior forecasting systems.
Google said its three-day forecasts were as accurate on average as earlier models' two-day forecasts, while generating ensembles of 1,000 possible scenarios to represent uncertainty and rare outcomes.
The company open-sourced WeatherNext Cyclones and WeatherNext 2 after using the system with forecasting agencies during the 2025 hurricane season.

## What Happened

Google DeepMind published results for WeatherNext Cyclones, a machine-learning weather model developed with researchers and forecasters from organizations including the US National Hurricane Center, the Cooperative Institute for Research in the Atmosphere, and the UK Met Office.
The accompanying research evaluated the model's ability to forecast a cyclone's path, intensity, and wind structure rather than concentrating only on storm tracks.

Google reported that WeatherNext Cyclones produced a similar improvement for both track and intensity forecasting.
Across the evaluation, a forecast issued three days before a storm state was approximately as accurate as earlier systems had been two days beforehand.
Google characterized the one-day gain as comparable to roughly a decade of historical forecasting progress.

The model used Functional Generative Networks to produce ensembles of possible weather outcomes.
Google expanded the system from 50 ensemble members in 2025 to 1,000 scenarios for each cyclone, including low-probability outcomes such as rapid intensification.
The company said a 15-day forecast could be generated in less than one minute on a tensor processing unit.

WeatherNext Cyclones operated on atmospheric inputs with a spatial resolution of approximately 28 by 28 kilometers, which Google described as about 100 times coarser than the data used by traditional high-resolution intensity models.
Researchers had expected detailed local inputs to be necessary for predicting intensity changes, and the team said it did not yet fully understand which signals the model extracted from the lower-resolution data.

Google and WIRED reported that forecasters used the model during the 2025 hurricane season, including for Hurricane Melissa's rapid intensification and landfall in Jamaica.
Mike Brennan, director of the National Hurricane Center, told WIRED that additional lead time could support evacuations, supply staging, and other preparations in which even several hours affect operational decisions.

Google released the WeatherNext Cyclones and WeatherNext 2 model code and weights for research and forecasting use.
The model remained an input to human forecasting rather than an autonomous warning system, and the reported performance had not yet been demonstrated across many operational seasons after publication.

## Why It Matters

The result extended AI weather forecasting from broad global prediction toward the two cyclone properties most directly connected to emergency planning: where a storm will travel and how strong it will become.
The Ledger's 2025 record of ECMWF making its AI forecasting system operational established that machine-learning models could run continuously inside a major forecasting organization.
WeatherNext Cyclones documented a narrower but higher-consequence claim that an AI system could improve lead time for rare, rapidly changing storms while representing uncertainty through large ensembles.

An additional day of accurate warning can alter when authorities order evacuations, position emergency supplies, close infrastructure, and communicate risk to the public.
The model's speed and open release could also make large ensemble forecasts more accessible to agencies and researchers that cannot operate the most computationally expensive physics-based systems.

The durability of the advance remained uncertain at publication.
The reported averages could conceal differences across ocean basins and storm types, the mechanism behind the lower-resolution model's intensity skill was not understood, and operational value would depend on performance over multiple seasons rather than one retrospective evaluation and a limited live deployment.
WeatherNext therefore represented evidence of a new forecasting capability, not a replacement for physical models, observational networks, or expert meteorologists.
