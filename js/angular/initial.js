
ngApp.filter('utcdate', function() {
        return function(date) {
            if (date == null || date == '') return '';

            date = date.replace('.000Z').replace('T', ' ');
            return moment(date, 'YYYY-MM-DDTHH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        };
    });

ngApp.config(
    function($routeSegmentProvider, $routeProvider, $locationProvider, $interpolateProvider) {
      $interpolateProvider.startSymbol('{{').endSymbol('}}');

      $routeSegmentProvider.options.autoLoadTemplates = true;      

      $routeProvider.otherwise({redirectTo: '/dashboard'});
      $routeSegmentProvider
        .when('/', 'dashboard')
        .when('/sign-in','sign-in')
        .when('/authentication_fail','sign-in')
        .when('/notAuthorised', 'notAuthorised')
        .when('/dashboard', 'dashboard')
        .when('/approve/:id/:token', 'approve_period')
        .when('/trips', 'trips.list')
        .when('/trips/:id', 'trips.details')
        .when('/management_panel', 'management_panel.settings')
        .when('/management_panel/permissions', 'management_panel.permissions')
        .when('/management_panel/settings', 'management_panel.settings')
        .when('/management_panel/settings/constants', 'management_panel.settings.constants')
        .when('/management_panel/settings/limit_values', 'management_panel.settings.limit_values')
        .when('/management_panel/settings/email_templates', 'management_panel.settings.email_templates')
        .when('/management_panel/settings/managers', 'management_panel.settings.managers')
        .when('/management_panel/settings/sales_staff', 'management_panel.settings.sales_staff')
        .when('/management_panel/settings/drivers_types', 'management_panel.settings.drivers_types')
        .when('/management_panel/roles', 'management_panel.roles')
        .when('/management_panel/create_user', 'management_panel.create_user')
        .when('/management_panel/logs', 'management_panel.logs')
        .when('/management_panel/vehicles_access', 'management_panel.vehicles_access')
        .when('/management_panel/apps_versions', 'management_panel.apps_versions')
        .when('/liverunning', 'autoview')
        .when('/drivers', 'drivers')
        .when('/drivers/list', 'drivers.list')
        .when('/drivers/periods_to_approve', 'drivers.periods_to_approve')
        .when('/drivers/:id', 'drivers.details.currentPeriod')
        .when('/drivers/:id/edit', 'drivers.details.edit')
        .when('/drivers/:id/trips', 'drivers.details.trips')
        .when('/drivers/:id/currentPeriod', 'drivers.details.currentPeriod')
        .when('/drivers/:id/inspections', 'drivers.details.inspections')
        .when('/drivers/:id/previousPeriods', 'drivers.details.previousPeriods')
        .when('/drivers/:id/previousPeriods/:period_id', 'drivers.details.previousPeriodDetails')
        .when('/reports', 'reports')
        .when('/reports/generate', 'reports.generate')
        .when('/companies', 'companies_list')
        .when('/companies/:id/details', 'company.details')
        .when('/companies/:id/company_heads', 'company.heads_list')
        .when('/companies/:id/company_heads/:head_id', 'company.head')
        .when('/vehicles', 'vehicles_list')
        .when('/vehicles/:id/details', 'vehicle.edit')
        .when('/vehicles/:id/edit', 'vehicle.edit')
        .when('/vehicles/:id/appointments', 'vehicle.appointments')
        .when('/vehicles/:id/inspections', 'vehicle.inspections')
        .when('/vehicles/create', 'vehicle_create')
        .when('/appointments' , 'appointments_list')
        .when('/appointments/create', 'appointment_create')
        .when('/appointments/:id/details', 'appointment.details')
        .when('/appointments/:id/edit', 'appointment.edit')
        .when('/appointments/:id/inspections', 'appointment.inspections')
        .when('/scheduler', 'scheduler.jobs.create_run')
        .when('/inspections/:id', 'inspection.details')
        .when('/inspections/:id/details', 'inspection.details')
        .when('/inspections/:id/edit', 'inspection.edit')
        .when('/inspections', 'inspections_list')

        .segment('sign-in', {
            templateUrl: 'templates/sign_in.html',
            controller: 'SigninController',
            access: {
                      requiredLogin: false,
                      requiredPermissions: []
                      },
            resolve: {login: function($q, $location) {
              var deferred = $q.defer(); 
              deferred.resolve();                         
              if (!(JSON.parse(localStorage.getItem("SESSION_USER")) == null)) {
                  window.location.href = '#/';
              }
              return deferred.promise;
            }}
        })

        .segment('notAuthorised', {
          templateUrl: 'templates/not_auth.html',
          controller: 'NotAuthorisedController',
          access: {
                      requiredLogin: false,
                      requiredPermissions: []
                      }
        })
        .segment('approve_period', {
          templateUrl: 'templates/approve_period.html',
          controller: 'ApprovePeriodController',
          access: {
                      requiredLogin: false,
                      requiredPermissions: []
                      }
        })

        .segment('dashboard', {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardController',
          access: {
                      requiredLogin: true,
                      requiredPermissions: []
                      }
        })

        .segment('trips', {
          controller: 'TripsController', 
          templateUrl: 'templates/trips/trips.html',
          access: {
            requiredLogin: true,
            requiredPermissions: []
          }
        })
              .within()
                  .segment('list', {
                      'default': true,
                      controller: 'TripsController',
                      templateUrl: 'templates/trips/list.html',
                      access: {
                      requiredLogin: true,
                      requiredPermissions: ['see driver trips list']
                      }
                  })
                  .segment('details', {
                      templateUrl: 'templates/trips/details.html',
                      controller: 'TripDetailsController',
                      dependencies: ['id'],
                      access: {
                        requiredLogin: true,
                        requiredPermissions: []
                      }
                  })
              .up()

        .segment('management_panel', {
          templateUrl: 'templates/management_panel/management_panel.html',
          access: {
                    requiredLogin: true,
                    requiredPermissions: []
                  }
        })
              .within()
                .segment('permissions', {
                  templateUrl: 'templates/management_panel/permissions.html',
                  controller: 'PermissionsController',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['grant permissions']
                  }
                })
                .segment('settings', {
                  templateUrl: 'templates/management_panel/settings.html',
                  controller: 'SettingsController',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['see settings']
                  }
                })
                    .within()
                        .segment('constants', {
                          templateUrl: 'templates/management_panel/company_settings/constants.html',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: ['see settings']
                          }
                        })
                        .segment('limit_values',{
                          templateUrl: 'templates/management_panel/company_settings/limit_values.html',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: ['see settings']
                          }
                        })
                        .segment('email_templates',{
                          templateUrl: 'templates/management_panel/company_settings/email_templates.html',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: ['see settings']
                          }
                        })
                        .segment('managers',{
                          templateUrl: 'templates/management_panel/company_settings/managers.html',
                          controller: 'ManagersController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: ['change driver manager']
                          }
                        })
                        .segment('sales_staff',{
                          templateUrl: 'templates/management_panel/company_settings/staff_reporting.html',
                          controller: 'StaffReportingController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: ['manage sales staff']
                          }
                        })
                        .segment('drivers_types',{
                          templateUrl: 'templates/management_panel/company_settings/drivers_types.html',
                          controller: 'DriversTypesController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: ['manage drivers types']
                          }
                        })
                    .up()
                .segment('roles', {
                  templateUrl: 'templates/management_panel/roles.html',
                  controller: 'RolesController',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['manage roles']
                  }
                })
                .segment('create_user', {
                  templateUrl: 'templates/management_panel/create_user.html',
                  controller: 'CreateUserController',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['create users']
                  }
                })
                .segment('logs',{
                  templateUrl: 'templates/management_panel/logs.html',
                  controller: 'LogsController',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['synchronize logs']
                  }
                })
                .segment('vehicles_access',{
                  templateUrl: 'templates/management_panel/vehicles_access.html',
                  controller: 'VehiclesAccessController',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['grant permissions']
                  }
                })
                .segment('apps_versions',{
                  templateUrl: 'templates/management_panel/apps_versions.html',
                  controller: 'AppsVersionsController',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['manage apps versions']
                  }
                })
              .up()

        .segment('autoview', {
            templateUrl: 'templates/autoview/autoview.html',
            controller: 'AutoViewController',
            access: {
                      requiredLogin: true,
                      requiredPermissions: ['see autoview']
            }
          })
        .segment('reports', {
            templateUrl: 'templates/reports/reports.html',
            controller: 'ReportsController',
            access: {
                      requiredLogin: true,
                      requiredPermissions: ['see reports']
            }
          })
            .within()
                .segment('generate', {
                  templateUrl: 'templates/reports/generate.html',
                  access: {
                    requiredLogin: true,
                    requiredPermissions: ['see reports']
                  }
                })
            .up()

        .segment('companies_list', {
            templateUrl: 'templates/companies/list.html',
            controller: 'CompaniesController',
            access: {
                      requiredLogin: true,
                      requiredPermissions: []
            }
          })

        .segment('company', {
            templateUrl: 'templates/companies/company/company.html',
            controller: 'CompanyController',
            dependencies: ['id'],
            access: {
                      requiredLogin: true,
                      requiredPermissions: []
            }
          })
            .within()
                .segment('details', {
                  templateUrl: 'templates/companies/company/details.html',
                  dependencies: ['id'],
                  access: {
                    requiredLogin: true,
                    requiredPermissions: []
                  }
                })
                .segment('heads_list', {
                  templateUrl: 'templates/companies/company/heads_list.html',
                  dependencies: ['id'],
                  access: {
                    requiredLogin: true,
                    requiredPermissions: []
                  }
                })
                .segment('head', {
                  templateUrl: 'templates/companies/company/head.html',
                  dependencies: ['id','head_id'],
                  access: {
                    requiredLogin: true,
                    requiredPermissions: []
                  }
                })
            .up()

        .segment('drivers', {
            templateUrl: 'templates/drivers/drivers.html',
            controller: 'DriversController',
            access: {
                      requiredLogin: true,
                      requiredPermissions: []
            }
          })
            .within()
                  .segment('periods_to_approve', {
                    templateUrl: 'templates/drivers/periods_to_approve.html',
                    controller: 'PeriodsToApproveController',
                    access: {
                      requiredLogin: true,
                      requiredPermissions: ['see drivers list'] //CHANGE TO "APPROVE PERIODS"
                    }
                  })
                  .segment('list', {
                    templateUrl: 'templates/drivers/list.html',
                    controller: 'DriversListController',
                    access: {
                      requiredLogin: true,
                      requiredPermissions: ['see drivers list']
                    }
                  })
                  .segment('details', {
                    templateUrl: 'templates/drivers/driver/menu.html',
                    controller: 'DriverMenuController',
                    dependencies: ['id'],
                    access: {
                      requiredLogin: true,
                      requiredPermissions: []
                    }
                  })
                    .within()
                        .segment('currentPeriod', {
                          templateUrl: 'templates/drivers/driver/current_period.html',
                          controller: 'DriverCurrentPeriodController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                        .segment('previous_periods', {
                          templateUrl: 'templates/drivers/driver/previous_periods.html',
                          controller: 'DriverPreviousPeriodsController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                        .segment('previous_period_details', {
                          templateUrl: 'templates/drivers/driver/previous_period_details.html',
                          controller: 'DriverPreviousPeriodDetailsController',
                          dependencies: ['period_id'],
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                        .segment('edit', {
                          templateUrl: 'templates/drivers/driver/edit.html',
                          controller: 'DriverEditController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                         .segment('trips', {
                          templateUrl: 'templates/drivers/driver/trips.html',
                          controller: 'DriverTripsController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                        .segment('inspections', {
                          templateUrl: 'templates/drivers/driver/inspections.html',
                          controller: 'DriverInspectionsController',
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                    .up()
            .up()

           .segment('vehicles_list', {
              templateUrl: 'templates/vehicles/list.html',
              controller: 'VehiclesListController',
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })

           .segment('vehicle_create', {
              templateUrl: 'templates/vehicles/create.html',
              controller: 'VehiclesListController',
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })

           .segment('vehicle', {
              templateUrl: 'templates/vehicles/vehicle.html',
              controller: 'VehicleDetailsController',
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })
                .within()
                        .segment('details', {
                          templateUrl: 'templates/vehicles/details.html',
                          dependencies: ['id'],
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                        .segment('edit', {
                          templateUrl: 'templates/vehicles/edit.html',
                          dependencies: ['id'],
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                        .segment('appointments', {
                          templateUrl: 'templates/vehicles/appointments.html',
                          dependencies: ['id'],
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                        .segment('inspections', {
                          templateUrl: 'templates/vehicles/inspections.html',
                          dependencies: ['id'],
                          access: {
                            requiredLogin: true,
                            requiredPermissions: []
                          }
                        })
                .up()
            .segment('appointments_list', {
              templateUrl: 'templates/appointments/list.html',
              controller: 'AppointmentsListController',
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })
            .segment('appointment_create', {
              templateUrl: 'templates/appointments/create.html',
              controller: 'AppointmentCreateController',
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })
            .segment('appointment', {
              templateUrl: 'templates/appointments/appointment.html',
              controller: 'AppointmentDetailsController',
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })
                .within()
                          .segment('details', {
                            templateUrl: 'templates/appointments/details.html',
                            dependencies: ['id'],
                            access: {
                              requiredLogin: true,
                              requiredPermissions: []
                            }
                          })
                          .segment('edit', {
                            templateUrl: 'templates/appointments/edit.html',
                            dependencies: ['id'],
                            access: {
                              requiredLogin: true,
                              requiredPermissions: []
                            }
                          })
                          .segment('inspections', {
                            templateUrl: 'templates/appointments/inspections.html',
                            dependencies: ['id'],
                            access: {
                              requiredLogin: true,
                              requiredPermissions: []
                            }
                          })
                  .up()

            .segment('scheduler', {
              templateUrl: 'templates/scheduler/scheduler.html',
              controller: 'SchedulerController',
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })
                .within()
                    .segment('jobs', {
                        templateUrl: 'templates/scheduler/jobs.html',
                        //controller: 'SchedulerJobsController',
                        access: {
                          requiredLogin: true,
                          requiredPermissions: []
                        }
                    })
                        .within()
                            .segment('create_run', {
                                templateUrl: 'templates/scheduler/create_run.html',
                                controller: 'SchedulerCreateJobsController',
                                access: {
                                  requiredLogin: true,
                                  requiredPermissions: []
                                }
                            })
                        .up()

                .up()

            .segment('inspection', {
              templateUrl: 'templates/inspections/inspection.html',
              controller: 'InspectionDetailsController',
              dependencies: ['id'],
              access: {
                        requiredLogin: true,
                        requiredPermissions: []
              }
            })
            .within()
                    .segment('details', {
                        templateUrl: 'templates/inspections/details.html',
                        access: {
                          requiredLogin: true,
                          requiredPermissions: []
                        }
                    })   
                    .segment('edit', {
                        templateUrl: 'templates/inspections/edit.html',
                        access: {
                          requiredLogin: true,
                          requiredPermissions: []
                        }
                    })    
            .up()
            .segment('inspections_list', {
                templateUrl: 'templates/inspections/list.html',
                controller: 'InspectionsListController',
                access: {
                  requiredLogin: true,
                  requiredPermissions: []
                }
            })
    }
);

ngApp.run(['$rootScope','$location', 'Auth', function ($rootScope, $location, Auth) {
        $rootScope.location = $location;
        $rootScope.$on("routeSegmentChange", function (event, route) {
          
          if(route.segment != null){ 
            var access = route.segment.params.access;
              var authorised;
              authorised = Auth.authorize(access.requiredLogin, access.requiredPermissions);
              if (authorised === -1) {
                  $location.path('/authentication_fail');
              } else if (authorised === 0) {
                  $location.path('/notAuthorised').replace();
              }
          }
        });
        $rootScope.$on('$stateChangeSuccess', function() {
          // document.body.scrollTop = document.documentElement.scrollTop = 0;
        });
    }]);

var URLS = {
  fetchPeriodToApproveDetails: BACKEND_HOST+'/period_to_approve_details',
  approvePeriodByToken: BACKEND_HOST+'/approve_period_by_token',

  fetchPermissionsData: BACKEND_HOST+'/fetch_permissions_data',
  fetchRolesData: BACKEND_HOST+'/fetch_roles_data',
  fetchCreateUserData: BACKEND_HOST+'/fetch_create_user_data',
  fetchSettingsData: BACKEND_HOST+'/fetch_settings_data',
  fetchTripsList: BACKEND_HOST+"/trips",
  fetchLogs: BACKEND_HOST+"/fetch_logs",
  fetchVehiclesAccessUsers: BACKEND_HOST+"/management_panel/vehicles_access_users",
  fetchUserVehicles: BACKEND_HOST+"/management_panel/user_vehicles",
  sendUserVehicles: BACKEND_HOST+"/management_panel/save_user_vehicles",
  fetchSalesStaff: BACKEND_HOST+"/management_panel/staff_users",
  sendSalesStaff: BACKEND_HOST+"/management_panel/save_staff_users",
  deleteTrip: BACKEND_HOST+"/trips/delete",
  tripDetails: BACKEND_HOST+"/trips/details",
  tripPoints: BACKEND_HOST+"/trips/listPoints",
  donglePoints: BACKEND_HOST+"/dongle/trip/",
  updateTrip: BACKEND_HOST+"/trips/updateTrip",
  moveTrip: BACKEND_HOST+"/trips/moveToPeriod", 
  charts: BACKEND_HOST+"/chart_data/trip/",

  fetchDriversTypes: BACKEND_HOST+'/hours_payroll/fetch_drivers_types',
  saveDriverType: BACKEND_HOST+'/hours_payroll/save_driver_type',

  fetchDriversAndManagers: BACKEND_HOST+"/fetch_managers_and_drivers",
  assigManagerToDriver: BACKEND_HOST+"/assign_manager_to_driver",

  sendRoles: BACKEND_HOST+'/send_roles',
  sendNewRole: BACKEND_HOST+'/new_role',
  sendUser: BACKEND_HOST+'/send_user',
  sendUserPermissions: BACKEND_HOST+'/send_user_permissions',
  sendSettingsValues: BACKEND_HOST+'/update_settings_data',
  removeSettingsValue: BACKEND_HOST+'/remove_settings_value',

  changeDriverPassword: BACKEND_HOST+'/drivers/changepassword',
  fetchPeriod: BACKEND_HOST+'/drivers/fetchPeriod',
  reopenPeriod: BACKEND_HOST+'/drivers/reopenPeriod',
  createDriver: BACKEND_HOST+'/drivers/create',
  driversList: BACKEND_HOST+'/drivers/list',
  changePeriodStartMileage: BACKEND_HOST+'/drivers/changePeriodStartMileage', 
  listTrips: BACKEND_HOST+'/drivers/listTrips', 
  driverListInspections: BACKEND_HOST+'/drivers/listInspections',
  driverDetails: BACKEND_HOST+'/drivers/details', 
  currentPeriod: BACKEND_HOST+'/drivers/getCurrentPeriod', 
  createPeriod: BACKEND_HOST+'/drivers/createPeriod', 
  closePeriod: BACKEND_HOST+'/drivers/closePeriod', 
  closedPeriods: BACKEND_HOST+'/drivers/getClosedPeriods', 
  approvePeriod: BACKEND_HOST+'/drivers/approve_period',     
  createTrip: BACKEND_HOST+'/trips/create', 
  refreshPeriodMileage: BACKEND_HOST+'/trips/refreshPeriodMileage',
  isLastClosedPeriod: BACKEND_HOST+'/drivers/isLastClosedPeriod',
  updateDriver: BACKEND_HOST+'/drivers/update',
  archiveUser: BACKEND_HOST+'/drivers/archive',
  fetchPeriodsToApprove: BACKEND_HOST+'/drivers/fetchPeriodsToApprove',
  approvePeriod: BACKEND_HOST+'/drivers/approve',

  companiesList: BACKEND_HOST+'/companies/list',
  companyCreate: BACKEND_HOST+'/companies/create',
  companyDetails: BACKEND_HOST+'/companies/details',
  companyHeads: BACKEND_HOST+'/companies/getCompanyHeads',
  companyHead: BACKEND_HOST+'/companies/getCompanyHead',
  createCompanyHead: BACKEND_HOST+'/companies/createCompanyHead',
  updateCompanyHead: BACKEND_HOST+'/companies/updateCompanyHead',
  changeCompanyHeadPassword: BACKEND_HOST+'/companies/changeCompanyHeadPassword',
  updateCompanyDetails: BACKEND_HOST+'/companies/updateDetails',

  vehicles_list: BACKEND_HOST+'/vehicles/list',
  vehicle_create: BACKEND_HOST+'/vehicles/create',
  vehicle_update: BACKEND_HOST+'/vehicles/update',
  vehicle_details: BACKEND_HOST+'/vehicles/:id/details',
  fetch_vehicles_pre_data: BACKEND_HOST+'/vehicles/pre_data',

  appointments_list: BACKEND_HOST+'/appointments/list',
  appointment_create: BACKEND_HOST+'/appointments/create',
  appointment_update: BACKEND_HOST+'/appointments/update',
  appointment_details: BACKEND_HOST+'/appointments/:id/details',
  fetch_appointments_pre_data: BACKEND_HOST+'/appointments/pre_data',
  inspections_list: BACKEND_HOST+'/inspections/list',
  inspection_details: BACKEND_HOST+'/inspections/:id',

  saveNewJobs: BACKEND_HOST+'/scheduler/save_new_jobs',
  fetchSchedulerDataToAllocate: BACKEND_HOST+'/scheduler/fetch_data_to_allocate',
  fetchSchedulerDataForDate: BACKEND_HOST+'/scheduler/fetch_data_for_date',
  fetchDriverJobs: BACKEND_HOST+'/scheduler/fetch_driver_jobs',
  deleteJob: BACKEND_HOST+'/scheduler/delete_job',

  damage_item_src: BACKEND_HOST+'/damages/',
  terms_item_src: BACKEND_HOST+'/inspections/',
  uploadPath: BACKEND_HOST+'/upload_apk',


};
window.ngApp = ngApp;